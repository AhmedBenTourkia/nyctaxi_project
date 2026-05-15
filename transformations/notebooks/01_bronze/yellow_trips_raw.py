# Databricks notebook source
from pyspark.sql.functions import current_timestamp
from dateutil.relativedelta import relativedelta
from datetime import date 

# COMMAND ----------

# 2 months prior in yyyy-MM format
two_months_ago = date.today() - relativedelta(months=2)
formated_date = two_months_ago.strftime("%Y-%m")



# COMMAND ----------

df = spark.read.format("parquet").load(f"/Volumes/nyctaxi/00_landing/datasources/nyc_taxi_yellow/{formated_date}")


# COMMAND ----------

df = df.withColumn("processed_timestamp", current_timestamp())



# COMMAND ----------

df.write.mode("append").saveAsTable("nyctaxi.01_bronze.yellow_trips_raw")