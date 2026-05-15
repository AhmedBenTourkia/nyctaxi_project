# Databricks notebook source
spark.sql(" create catalog if not exists nyctaxi managed location 'abfss://unity-catalog-storage@dbstorage4m7ua3odf4hey.dfs.core.windows.net/7405613978821277'")

# COMMAND ----------

spark.sql(" create schema if not exists nyctaxi.00_landing")
spark.sql(" create schema if not exists nyctaxi.01_bronze")
spark.sql(" create schema if not exists nyctaxi.02_silver")
spark.sql(" create schema if not exists nyctaxi.03_gold")

# COMMAND ----------

spark.sql("create volume if not exists nyctaxi.00_landing.datasources")