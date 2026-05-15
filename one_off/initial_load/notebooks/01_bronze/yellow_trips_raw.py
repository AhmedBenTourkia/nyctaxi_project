# Databricks notebook source
from pyspark.sql.functions import current_timestamp

# COMMAND ----------

df = spark.read.format("parquet").load("/Volumes/nyctaxi/00_landing/datasources/nyc_taxi_yellow/*")

# COMMAND ----------

df.display()

# COMMAND ----------

df = df.withColumn("processed_timestamp", current_timestamp())


# COMMAND ----------

df.write.mode("overwrite").saveAsTable("nyctaxi.01_bronze.yellow_trips_raw")