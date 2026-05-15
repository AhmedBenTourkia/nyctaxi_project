# Databricks notebook source
import sys
import os
#Reach project root
project_root = os.path.abspath(os.path.join(os.getcwd(), "../.."))

if project_root not in sys.path:
    sys.path.append(project_root)

import urllib.request
import shutil
from modules.data_loader.file_downloader import download_file

# COMMAND ----------

try:
    url_target = "https://d37ci6vzurychx.cloudfront.net/misc/taxi_zone_lookup.csv"

    dir_path = f"/Volumes/nyctaxi/00_landing/datasources/lookup"

    local_path = f"{dir_path}/Volumes/nyctaxi/00_landing/datasources/lookup"

    download_file(url_target, dir_path, local_path)

    dbutils.jobs.taskValues.set(key="continue_downstream",value="yes")
    print("file successfully uploaded")

except Exception as e: 
    dbutils.jobs.taskValues.set(key="continue_downstream",value="no")
    print(f"file not uploaded : {str(e)}")