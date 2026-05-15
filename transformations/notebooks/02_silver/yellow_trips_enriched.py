# Databricks notebook source
import sys
import os
#Reach project root
project_root = os.path.abspath(os.path.join(os.getcwd(), "../.."))

if project_root not in sys.path:
    sys.path.append(project_root)

from pyspark.sql.functions import col
from datetime import date
from dateutil.relativedelta import relativedelta
from modules.utils.date_utils import get_month_start_n_months_ago
# COMMAND ----------

two_months_ago = get_month_start_n_months_ago(2)

# COMMAND ----------

df_trips = spark.read.table("nyctaxi.02_silver.yellow_trips_cleansed").filter(f"tpep_pickup_datetime >= '{two_months_ago}'")

df_zones = spark.read.table("nyctaxi.02_silver.taxi_zone_lookup")



# COMMAND ----------

df = (
    df_trips.alias("t")
    .join(
        df_zones.alias("z"),
        col("t.pu_location_id") == col("z.location_id"),
        "left"
    )
    .select(
        "t.*",
        col("z.zone").alias("pu_zone"),
        col("z.borough").alias("pu_borough")
    )
    
)



# COMMAND ----------

df_final = (
    df.alias("t")
    .join(
        df_zones.alias("z"),
        col("t.do_location_id") == col("z.location_id"),
        "left"
    )
    .select(
        "t.*",
        col("z.zone").alias("do_zone"),
        col("z.borough").alias("do_borough")
    )
    .drop("pu_location_id", "do_location_id")
)
df_final.display()


# COMMAND ----------

df_final.write.mode("append").saveAsTable("nyctaxi.02_silver.yellow_trips_enriched")