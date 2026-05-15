# Databricks notebook source
from pyspark.sql.functions import col, when, timestamp_diff
from datetime import date
from dateutil.relativedelta import relativedelta

# COMMAND ----------

# Get the first day of the month two months ago
two_months_ago_start = date.today().replace(day=1) - relativedelta(months=2)

# Get the first day of the month one month ago
one_month_ago_start = date.today().replace(day=1) - relativedelta(months=1)

# COMMAND ----------

df = spark.read.table("nyctaxi.01_bronze.yellow_trips_raw").filter(f"tpep_pickup_datetime >= '{two_months_ago_start}' AND tpep_pickup_datetime < '{one_month_ago_start}'")

# COMMAND ----------

df_1 = df.select (
    when(col("VendorID") == 1, "Creative Mobile Technologies, LLC")
        .when(col("VendorID") == 2, "Curb Mobility, LLC")
        .when(col("VendorID") == 3, "Myle Technologies Inc ")
        .when(col("VendorID") == 7, "Helix")
        .otherwise("Unknown")
        .alias("vendor"),
    "tpep_pickup_datetime",
    "tpep_dropoff_datetime",
    timestamp_diff("MINUTE",col("tpep_pickup_datetime"), col("tpep_dropoff_datetime")).alias("trip_duration_mins"),
    "passenger_count",
    "trip_distance",
    when(col("RatecodeID") == 1, "Standard rate")
        .when(col("RatecodeID") == 2, "JFK")
        .when(col("RatecodeID") == 3, "Newark")
        .when(col("RatecodeID") == 4, "Nassau or Westchester")
        .when(col("RatecodeID") == 5, "Negotiated fare")
        .when(col("RatecodeID") == 6, "Group ride")
        .otherwise("Unknown")
        .alias("rate_type"),
    col("store_and_fwd_flag"),
    col("PULocationID").alias("pu_location_id"),
    col("DOLocationID").alias("do_location_id"),
    when(col("payment_type") == 0, "Flex Fare trip")
        .when(col("payment_type") == 1, "Credit card ")
        .when(col("payment_type") == 2, "Cash ")
        .when(col("payment_type") == 3, "No Charge")
        .when(col("payment_type") == 4, "Dispute")
        .when(col("payment_type") == 5,"Unknown")
        .when(col("payment_type") == 6, "Voided trip")
        .otherwise("NULL")
        .alias("payment_type"),
    "fare_amount",
    "extra",
    "mta_tax",
    "tip_amount",
    "tolls_amount",
    "improvement_surcharge",
    "total_amount",
    "congestion_surcharge",
    "airport_fee",
    "cbd_congestion_fee",
    "processed_timestamp"
)

# COMMAND ----------

df_1.write.mode("append").saveAsTable("nyctaxi.02_silver.yellow_trips_cleansed")