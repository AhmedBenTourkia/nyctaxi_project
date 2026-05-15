# Databricks notebook source
from pyspark.sql.functions import *

# COMMAND ----------

df = spark.read.table("nyctaxi.02_silver.yellow_trips_enriched")
df.display()

# COMMAND ----------

df.groupBy("vendor").agg(sum("total_amount")).orderBy("sum(total_amount)").alias("total_revenue").display()