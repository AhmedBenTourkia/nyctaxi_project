# Databricks notebook source
from pyspark.sql.functions import col
from datetime import date
from dateutil.relativedelta import relativedelta

# COMMAND ----------

two_months_ago = date.today().replace(day=1) - relativedelta(months=2)

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