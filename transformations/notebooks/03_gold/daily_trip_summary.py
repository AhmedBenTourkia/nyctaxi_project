# Databricks notebook source
import sys
import os
#Reach project root
project_root = os.path.abspath(os.path.join(os.getcwd(), "../.."))

if project_root not in sys.path:
    sys.path.append(project_root)

from pyspark.sql.functions import min, max, avg , sum, round, count
from datetime import date
from dateutil.relativedelta import relativedelta
from modules.utils.date_utils import get_month_start_n_months_ago
# COMMAND ----------

two_months_ago = get_month_start_n_months_ago(2)

# COMMAND ----------

df = spark.read.table("nyctaxi.02_silver.yellow_trips_enriched").filter(f"tpep_pickup_datetime > '{two_months_ago}'")
df.display()

# COMMAND ----------

df_daily = df.groupBy(df.tpep_pickup_datetime.cast("date").alias("pickup_date")).\
    agg(
        count("*").alias("total_trips"),
        round(avg("passenger_count"),1).alias("avg_passenger_per_trip"),
        round(avg("trip_distance"),2).alias("avg_distance_by_trip"),
        round(avg("fare_amount"),2).alias("avg_fare_per_trip"),
        max("fare_amount").alias("max_fare"),
        min("fare_amount").alias("min_fare"),
        round(sum("total_amount"),2).alias("total_revenue")


    )
        

# COMMAND ----------

df_daily.write.mode("append").saveAsTable("nyctaxi.03_gold.daily_trip_summary")