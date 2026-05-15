# Databricks notebook source
import urllib.request
import shutil
import os

# COMMAND ----------

dates_to_process = ['2025-06','2025-07', '2025-08', '2025-09', '2025-10', '2025-11']

for date in dates_to_process:
    url = f"https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_{date}.parquet"


    response = urllib.request.urlopen(url)

    dir_path = f"/Volumes/nyctaxi/00_landing/datasources/nyc_taxi_yellow/{date}"

    os.makedirs(dir_path, exist_ok=True)

    local_path =  f"{dir_path}/yellow_tripdata_{date}.parquet"

    with open(local_path, 'wb') as f:
        shutil.copyfileobj(response, f)



# COMMAND ----------

url_target = "https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv"

response = urllib.request.urlopen(url_target)

dir_path = "/Volumes/nyctaxi/00_landing/datasources/lookup"

os.makedirs(dir_path, exist_ok=True)

local_path = f"{dir_path}/taxi_zone_lookup.csv"


with open(local_path, 'wb') as f:
    shutil.copyfileobj(response, f)