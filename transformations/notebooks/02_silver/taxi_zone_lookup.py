# Databricks notebook source
from pyspark.sql.functions import current_timestamp, lit, col
from pyspark.sql.types import TimestampType, IntegerType
from delta.tables import DeltaTable
from datetime import datetime

# COMMAND ----------

df = spark.read.format("csv").options(header='true').load("/Volumes/nyctaxi/00_landing/datasources/lookup/taxi_zone_lookup.csv")




# COMMAND ----------

df = df.select (
    col("LocationID").cast(IntegerType()).alias("location_id"),
    col("Borough").alias("borough"),
    col("Zone").alias("zone"),
    col("service_zone"),
    current_timestamp().alias("effective_date"),
    lit(None).cast(TimestampType()).alias("end_date")
)


# COMMAND ----------

#fixed date to close any expired record
end_timestamp = datetime.now()

dt = deltaTable = DeltaTable.forName(spark, "nyctaxi.02_silver.taxi_zone_lookup")


# COMMAND ----------

#find records that has a matching id but different borough, zone, service_zone and end_date should be null (active records)
dt.alias("t").merge(
    source = df.alias("s"),
    condition = "t.location_id = s.location_id AND t.end_date IS NULL AND (t.borough != s.borough OR t.zone != s.zone OR t.service_zone != s.service_zone)"
).whenMatchedUpdate(
    set = {
        "t.end_date": lit(end_timestamp).cast(TimestampType())
    }
).execute()



# COMMAND ----------

id_list = [row.location_id for row in dt.toDF().filter(f"end_date = '{end_timestamp}' ").select("location_id").collect()]

# if list is empty, no need to insert anything 
if len(id_list) == 0:
    print("No updated records")
else:
    dt.alias("t").\
        merge(
            source    = df.alias("s"),
            condition = f"s.location_id not in ({', '.join(map(str, id_list))})" #here the inverse condition is used because only whenNotMatchedInsert can be used.
        ).\
        whenNotMatchedInsert(
            values = { "t.location_id": "s.location_id",
                    "t.borough": "s.borough",
                    "t.zone": "s.zone",
                    "t.service_zone": "s.service_zone",
                    "t.effective_date": current_timestamp(),
                    "t.end_date": lit(None).cast(TimestampType()) }
        ).execute()


# COMMAND ----------

# insert new record 

dt.alias("t").\
    merge(
        source    = df.alias("s"),
        condition = "t.location_id = s.location_id"
    ).\
    whenNotMatchedInsert(
        values = { "t.location_id": "s.location_id",
                "t.borough": "s.borough",
                "t.zone": "s.zone",
                "t.service_zone": "s.service_zone",
                "t.effective_date": current_timestamp(),
                "t.end_date": lit(None).cast(TimestampType()) }
    ).execute()

# COMMAND ----------

