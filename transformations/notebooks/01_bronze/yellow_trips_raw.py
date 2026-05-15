# Databricks notebook source
import sys
import os
#Reach project root
project_root = os.path.abspath(os.path.join(os.getcwd(), "../.."))

if project_root not in sys.path:
    sys.path.append(project_root)

from pyspark.sql.functions import current_timestamp
from dateutil.relativedelta import relativedelta
from datetime import date
from modules.transformations.metadata import add_processed_timestamp
from modules.utils.date_utils import get_target_yyyymm 

# COMMAND ----------

# 2 months prior in yyyy-MM format
formated_date = get_target_yyyymm(2)



# COMMAND ----------

df = spark.read.format("parquet").load(f"/Volumes/nyctaxi/00_landing/datasources/nyc_taxi_yellow/{formated_date}")


# COMMAND ----------

df = add_processed_timestamp(df)



# COMMAND ----------

df.write.mode("append").saveAsTable("nyctaxi.01_bronze.yellow_trips_raw")