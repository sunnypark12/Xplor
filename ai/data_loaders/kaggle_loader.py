"""
Kaggle dataset loader for tourism and travel data
"""
import pandas as pd
from kaggle.api.kaggle_api_extended import KaggleApi
from typing import Dict, Optional, List
import os
import logging
from config.settings import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class KaggleDataLoader:
    """Handles loading and caching of Kaggle datasets"""
    
    def __init__(self):
        self.cache_dir = settings.DATA_CACHE_DIR
        os.makedirs(self.cache_dir, exist_ok=True)
        self.api = KaggleApi()
        self.api.authenticate()
        
    def load_tourism_spots_dataset(self, file_path: str = "") -> pd.DataFrame:
        """
        Load tourism informatization of scenic spots dataset
        Contains information about tourist attractions, facilities, and visitor data
        """
        try:
            logger.info("Loading tourism spots dataset...")
            
            # Download dataset files
            self.api.dataset_download_files(
                settings.KAGGLE_DATASETS["tourism_spots"],
                path=self.cache_dir,
                unzip=True
            )
            
            # Load the dataset
            dataset_path = os.path.join(self.cache_dir, file_path) if file_path else self.cache_dir
            csv_files = [f for f in os.listdir(dataset_path) if f.endswith('.csv')]
            
            if csv_files:
                df = pd.read_csv(os.path.join(dataset_path, csv_files[0]))
                logger.info(f"Loaded tourism spots dataset with {len(df)} records")
                self._cache_dataset(df, "tourism_spots")
                return df
            else:
                logger.warning("No CSV files found in tourism spots dataset")
                return pd.DataFrame()
            
        except Exception as e:
            logger.error(f"Error loading tourism spots dataset: {e}")
            return self._load_cached_dataset("tourism_spots")
    
    def load_tourist_destinations_dataset(self, file_path: str = "") -> pd.DataFrame:
        """
        Load popular tourist destinations and their features dataset
        Contains destination features, ratings, popularity metrics
        """
        try:
            logger.info("Loading tourist destinations dataset...")
            
            # Download dataset files
            self.api.dataset_download_files(
                settings.KAGGLE_DATASETS["tourist_destinations"],
                path=self.cache_dir,
                unzip=True
            )
            
            # Load the dataset
            dataset_path = os.path.join(self.cache_dir, file_path) if file_path else self.cache_dir
            csv_files = [f for f in os.listdir(dataset_path) if f.endswith('.csv')]
            
            if csv_files:
                df = pd.read_csv(os.path.join(dataset_path, csv_files[0]))
                logger.info(f"Loaded tourist destinations dataset with {len(df)} records")
                self._cache_dataset(df, "tourist_destinations")
                return df
            else:
                logger.warning("No CSV files found in tourist destinations dataset")
                return pd.DataFrame()
            
        except Exception as e:
            logger.error(f"Error loading tourist destinations dataset: {e}")
            return self._load_cached_dataset("tourist_destinations")
    
    def load_traveler_trips_dataset(self, file_path: str = "") -> pd.DataFrame:
        """
        Load traveler trip data dataset
        Contains historical trip data, preferences, and travel patterns
        """
        try:
            logger.info("Loading traveler trips dataset...")
            
            # Download dataset files
            self.api.dataset_download_files(
                settings.KAGGLE_DATASETS["traveler_trips"],
                path=self.cache_dir,
                unzip=True
            )
            
            # Load the dataset
            dataset_path = os.path.join(self.cache_dir, file_path) if file_path else self.cache_dir
            csv_files = [f for f in os.listdir(dataset_path) if f.endswith('.csv')]
            
            if csv_files:
                df = pd.read_csv(os.path.join(dataset_path, csv_files[0]))
                logger.info(f"Loaded traveler trips dataset with {len(df)} records")
                self._cache_dataset(df, "traveler_trips")
                return df
            else:
                logger.warning("No CSV files found in traveler trips dataset")
                return pd.DataFrame()
            
        except Exception as e:
            logger.error(f"Error loading traveler trips dataset: {e}")
            return self._load_cached_dataset("traveler_trips")
    
    def load_all_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all Kaggle datasets and return as dictionary"""
        datasets = {}
        
        datasets["tourism_spots"] = self.load_tourism_spots_dataset()
        datasets["tourist_destinations"] = self.load_tourist_destinations_dataset()
        datasets["traveler_trips"] = self.load_traveler_trips_dataset()
        
        return datasets
    
    def _cache_dataset(self, df: pd.DataFrame, dataset_name: str) -> None:
        """Cache dataset to local storage"""
        try:
            cache_path = os.path.join(self.cache_dir, f"{dataset_name}.parquet")
            df.to_parquet(cache_path)
            logger.info(f"Cached {dataset_name} dataset to {cache_path}")
        except Exception as e:
            logger.warning(f"Failed to cache {dataset_name}: {e}")
    
    def _load_cached_dataset(self, dataset_name: str) -> pd.DataFrame:
        """Load dataset from cache if available"""
        try:
            cache_path = os.path.join(self.cache_dir, f"{dataset_name}.parquet")
            if os.path.exists(cache_path):
                df = pd.read_parquet(cache_path)
                logger.info(f"Loaded {dataset_name} from cache with {len(df)} records")
                return df
        except Exception as e:
            logger.warning(f"Failed to load cached {dataset_name}: {e}")
        
        logger.warning(f"No cached data available for {dataset_name}")
        return pd.DataFrame()
    
    def get_dataset_summary(self, df: pd.DataFrame, dataset_name: str) -> Dict:
        """Get summary statistics for a dataset"""
        if df.empty:
            return {"error": f"Dataset {dataset_name} is empty"}
        
        return {
            "name": dataset_name,
            "shape": df.shape,
            "columns": list(df.columns),
            "dtypes": df.dtypes.to_dict(),
            "null_counts": df.isnull().sum().to_dict(),
            "memory_usage": df.memory_usage(deep=True).sum(),
            "sample_data": df.head(3).to_dict()
        }

