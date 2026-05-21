# Databricks notebook source
from pyspark.sql.functions import date_format
# Add a year_month column to the dataframe

df = spark.read.table("nyctaxi.`02_silver`.yellow_trips_enriched")
df = df.withColumn("year_month", date_format("tpep_pickup_datetime", "yyyy-MM"))

#Write yellow_trips data in JSON format to the external table "yellow_trips_export"

df.write.\
    option("path","abfss://nyctaxi-yellow@nyctaxistorage100.dfs.core.windows.net/yellow_trips_export").\
    mode("overwrite").\
    format("json").\
    partitionBy("vendor","year_month").\
    saveAsTable("nyctaxi.04_export.yellow_trips_export")