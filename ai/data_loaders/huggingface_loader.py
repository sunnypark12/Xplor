"""
HuggingFace dataset loader for travel and restaurant data
"""
import pandas as pd
from datasets import load_dataset, Dataset
from typing import Dict, Optional, List, Any
import os
import logging
from config.settings import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HuggingFaceDataLoader:
    """Handles loading and processing of HuggingFace datasets"""
    
    def __init__(self):
        self.cache_dir = settings.DATA_CACHE_DIR
        os.makedirs(self.cache_dir, exist_ok=True)
        
    def load_travel_planner_dataset(self, split: str = "train") -> pd.DataFrame:
        """
        Load TravelPlanner dataset from osunlp
        Contains comprehensive travel planning data with itineraries
        """
        try:
            logger.info(f"Loading TravelPlanner dataset (split: {split})...")
            dataset = load_dataset(
                settings.HUGGINGFACE_DATASETS["travel_planner"], 
                split=split,
                cache_dir=self.cache_dir
            )
            
            # Convert to pandas DataFrame
            df = dataset.to_pandas()
            logger.info(f"Loaded TravelPlanner dataset with {len(df)} records")
            
            self._cache_dataset(df, f"travel_planner_{split}")
            return df
            
        except Exception as e:
            logger.error(f"Error loading TravelPlanner dataset: {e}")
            return self._load_cached_dataset(f"travel_planner_{split}")
    
    def load_restaurant_reviews_dataset(self, split: str = "train") -> pd.DataFrame:
        """
        Load restaurant reviews dataset from deelow
        Contains restaurant reviews, ratings, and sentiment data
        """
        try:
            logger.info(f"Loading restaurant reviews dataset (split: {split})...")
            dataset = load_dataset(
                settings.HUGGINGFACE_DATASETS["restaurant_reviews"], 
                split=split,
                cache_dir=self.cache_dir
            )
            
            df = dataset.to_pandas()
            logger.info(f"Loaded restaurant reviews dataset with {len(df)} records")
            
            self._cache_dataset(df, f"restaurant_reviews_{split}")
            return df
            
        except Exception as e:
            logger.error(f"Error loading restaurant reviews dataset: {e}")
            return self._load_cached_dataset(f"restaurant_reviews_{split}")
    
    def load_restaurant_cooking_dataset(self, split: str = "train") -> pd.DataFrame:
        """
        Load whatscooking restaurants dataset from MongoDB
        Contains restaurant cuisine types, ingredients, and cooking data
        """
        try:
            logger.info(f"Loading restaurant cooking dataset (split: {split})...")
            dataset = load_dataset(
                settings.HUGGINGFACE_DATASETS["restaurant_cooking"], 
                split=split,
                cache_dir=self.cache_dir
            )
            
            df = dataset.to_pandas()
            logger.info(f"Loaded restaurant cooking dataset with {len(df)} records")
            
            self._cache_dataset(df, f"restaurant_cooking_{split}")
            return df
            
        except Exception as e:
            logger.error(f"Error loading restaurant cooking dataset: {e}")
            return self._load_cached_dataset(f"restaurant_cooking_{split}")
    
    def load_all_datasets(self, split: str = "train") -> Dict[str, pd.DataFrame]:
        """Load all HuggingFace datasets and return as dictionary"""
        datasets = {}
        
        datasets["travel_planner"] = self.load_travel_planner_dataset(split)
        datasets["restaurant_reviews"] = self.load_restaurant_reviews_dataset(split)
        datasets["restaurant_cooking"] = self.load_restaurant_cooking_dataset(split)
        
        return datasets
    
    def get_dataset_info(self, dataset_name: str) -> Dict[str, Any]:
        """Get information about available splits and features for a dataset"""
        try:
            if dataset_name not in settings.HUGGINGFACE_DATASETS:
                return {"error": f"Unknown dataset: {dataset_name}"}
            
            dataset_path = settings.HUGGINGFACE_DATASETS[dataset_name]
            dataset_info = load_dataset(dataset_path, cache_dir=self.cache_dir)
            
            return {
                "dataset_name": dataset_name,
                "dataset_path": dataset_path,
                "available_splits": list(dataset_info.keys()),
                "features": {split: list(data.features.keys()) for split, data in dataset_info.items()},
                "num_rows": {split: len(data) for split, data in dataset_info.items()}
            }
            
        except Exception as e:
            logger.error(f"Error getting dataset info for {dataset_name}: {e}")
            return {"error": str(e)}
    
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
    
    def process_travel_planner_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process and clean TravelPlanner dataset for better usability"""
        if df.empty:
            return df
        
        processed_df = df.copy()
        
        # Add any specific processing logic for travel planner data
        # This could include parsing JSON fields, extracting locations, etc.
        
        return processed_df
    
    def extract_restaurant_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract key features from restaurant datasets"""
        if df.empty:
            return df
        
        processed_df = df.copy()
        
        # Add any specific processing logic for restaurant data
        # This could include sentiment analysis, cuisine categorization, etc.
        
        return processed_df

