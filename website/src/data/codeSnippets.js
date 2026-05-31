export const snippets = [
  {
    id: 'landing',
    label: '00 Landing',
    file: '00_landing/ingest_yellow_trips.py',
    language: 'python',
    description: 'Downloads the monthly NYC taxi parquet file. Idempotent — skips if already downloaded. Passes downstream continuation flag via Databricks task values.',
    code: `# Databricks notebook source
import sys, os
from modules.data_loader.file_downloader import download_file
from modules.utils.date_utils import get_target_yyyymm

formatted_date = get_target_yyyymm(2)

dir_path   = f"/Volumes/nyctaxi/00_landing/datasources/nyc_taxi_yellow/{formatted_date}"
local_path = f"{dir_path}/yellow_tripdata_{formatted_date}.parquet"

try:
    dbutils.fs.ls(local_path)
    dbutils.jobs.taskValues.set(key="continue_downstream", value="no")
    print("File already downloaded, aborting downstream tasks")
except:
    try:
        url = (
            "https://d37ci6vzurychx.cloudfront.net"
            f"/trip-data/yellow_tripdata_{formatted_date}.parquet"
        )
        download_file(url, dir_path, local_path)
        dbutils.jobs.taskValues.set(key="continue_downstream", value="yes")
        print("File successfully uploaded in current run")
    except Exception as e:
        dbutils.jobs.taskValues.set(key="continue_downstream", value="no")
        print(f"File download failed: {str(e)}")`,
  },
  {
    id: 'silver-cleanse',
    label: '02 Silver — Cleanse',
    file: '02_silver/yellow_trips_cleansed.py',
    language: 'python',
    description: 'Decodes raw numeric codes into human-readable labels, renames columns to snake_case, and calculates trip duration in minutes.',
    code: `# Databricks notebook source
from pyspark.sql.functions import col, when, timestamp_diff
from modules.utils.date_utils import get_month_start_n_months_ago

two_months_ago = get_month_start_n_months_ago(2)
one_month_ago  = get_month_start_n_months_ago(1)

df = (
    spark.read.table("nyctaxi.01_bronze.yellow_trips_raw")
    .filter(f"tpep_pickup_datetime >= '{two_months_ago}' "
            f"AND tpep_pickup_datetime < '{one_month_ago}'")
)

df_cleansed = df.select(
    when(col("VendorID") == 1, "Creative Mobile Technologies, LLC")
        .when(col("VendorID") == 2, "Curb Mobility, LLC")
        .when(col("VendorID") == 3, "Myle Technologies Inc")
        .when(col("VendorID") == 7, "Helix")
        .otherwise("Unknown").alias("vendor"),
    "tpep_pickup_datetime",
    "tpep_dropoff_datetime",
    timestamp_diff("MINUTE",
        col("tpep_pickup_datetime"),
        col("tpep_dropoff_datetime")
    ).alias("trip_duration_mins"),
    "passenger_count",
    "trip_distance",
    when(col("RatecodeID") == 1, "Standard rate")
        .when(col("RatecodeID") == 2, "JFK")
        .when(col("RatecodeID") == 3, "Newark")
        .when(col("RatecodeID") == 4, "Nassau or Westchester")
        .when(col("RatecodeID") == 5, "Negotiated fare")
        .when(col("RatecodeID") == 6, "Group ride")
        .otherwise("Unknown").alias("rate_type"),
    col("PULocationID").alias("pu_location_id"),
    col("DOLocationID").alias("do_location_id"),
    when(col("payment_type") == 1, "Credit card")
        .when(col("payment_type") == 2, "Cash")
        .when(col("payment_type") == 3, "No Charge")
        .when(col("payment_type") == 4, "Dispute")
        .otherwise("Unknown").alias("payment_type"),
    "fare_amount", "tip_amount", "tolls_amount",
    "total_amount", "congestion_surcharge",
    "processed_timestamp",
)

df_cleansed.write.mode("append").saveAsTable(
    "nyctaxi.02_silver.yellow_trips_cleansed"
)`,
  },
  {
    id: 'silver-enrich',
    label: '02 Silver — Enrich',
    file: '02_silver/yellow_trips_enriched.py',
    language: 'python',
    description: 'Joins cleansed trips with the taxi zone lookup table twice — once for pickup zone and once for dropoff zone — adding borough names.',
    code: `# Databricks notebook source
from pyspark.sql.functions import col
from modules.utils.date_utils import get_month_start_n_months_ago

two_months_ago = get_month_start_n_months_ago(2)

df_trips = (
    spark.read.table("nyctaxi.02_silver.yellow_trips_cleansed")
    .filter(f"tpep_pickup_datetime >= '{two_months_ago}'")
)
df_zones = spark.read.table("nyctaxi.02_silver.taxi_zone_lookup")

# Join pickup zone
df_with_pu = (
    df_trips.alias("t")
    .join(df_zones.alias("z"),
          col("t.pu_location_id") == col("z.location_id"), "left")
    .select("t.*",
            col("z.zone").alias("pu_zone"),
            col("z.borough").alias("pu_borough"))
)

# Join dropoff zone
df_final = (
    df_with_pu.alias("t")
    .join(df_zones.alias("z"),
          col("t.do_location_id") == col("z.location_id"), "left")
    .select("t.*",
            col("z.zone").alias("do_zone"),
            col("z.borough").alias("do_borough"))
    .drop("pu_location_id", "do_location_id")
)

df_final.write.mode("append").saveAsTable(
    "nyctaxi.02_silver.yellow_trips_enriched"
)`,
  },
  {
    id: 'gold',
    label: '03 Gold',
    file: '03_gold/daily_trip_summary.py',
    language: 'python',
    description: 'Aggregates enriched trip data into daily summaries — the analytics-ready Gold layer consumed by dashboards and this website.',
    code: `# Databricks notebook source
from pyspark.sql.functions import min, max, avg, sum, round, count
from modules.utils.date_utils import get_month_start_n_months_ago

two_months_ago = get_month_start_n_months_ago(2)

df = (
    spark.read.table("nyctaxi.02_silver.yellow_trips_enriched")
    .filter(f"tpep_pickup_datetime > '{two_months_ago}'")
)

df_daily = (
    df.groupBy(
        df.tpep_pickup_datetime.cast("date").alias("pickup_date")
    )
    .agg(
        count("*").alias("total_trips"),
        round(avg("passenger_count"), 1).alias("avg_passenger_per_trip"),
        round(avg("trip_distance"),   2).alias("avg_distance_by_trip"),
        round(avg("fare_amount"),     2).alias("avg_fare_per_trip"),
        max("fare_amount").alias("max_fare"),
        min("fare_amount").alias("min_fare"),
        round(sum("total_amount"),    2).alias("total_revenue"),
    )
)

df_daily.write.mode("append").saveAsTable(
    "nyctaxi.03_gold.daily_trip_summary"
)`,
  },
  {
    id: 'utils',
    label: 'Modules / Utils',
    file: 'modules/utils/date_utils.py',
    language: 'python',
    description: 'Reusable date utility module used by every pipeline stage. Ensures all notebooks target the same 2-month-ago window without hardcoding dates.',
    code: `from datetime import date
from dateutil.relativedelta import relativedelta


def get_target_yyyymm(months_ago: int = 2) -> str:
    """
    Returns the yyyy-MM string for the given number of months ago.
    e.g. if today is 2024-03-15 and months_ago=2, returns '2024-01'
    """
    target_date = date.today() - relativedelta(months=months_ago)
    return target_date.strftime("%Y-%m")


def get_month_start_n_months_ago(months_ago: int = 2) -> date:
    """
    Returns the first day of the month N months ago.
    Used for incremental filter predicates in Spark reads.

    Parameters:
        months_ago (int): How many months back (default 2)

    Returns:
        date: First day of the target month
    """
    return date.today().replace(day=1) - relativedelta(months=months_ago)`,
  },
]
