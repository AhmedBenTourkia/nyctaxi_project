from pyspark.sql import DataFrame
from pyspark.sql.functions import current_timestamp

def add_processed_timestamp(df: DataFrame) -> DataFrame:
    """
    Adds a 'processed_timestamp' column to the DataFrame with the current timestamps.

    Parameters:
        df (DataFrame): the input Spark DataFrame.

    Returns:
        DataFrame: The DataFrame with an additional 'processed_timestamp' column.
    """

    return df.withColumn("processed_timestamp", current_timestamp())