"""
Data processing utilities for the AI Travel Agent
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional, Tuple
import re
import logging
from datetime import datetime, timedelta
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    """Utility class for data processing and cleaning"""
    
    @staticmethod
    def clean_destination_data(df: pd.DataFrame) -> pd.DataFrame:
        """Clean and standardize destination data"""
        if df.empty:
            return df
        
        cleaned_df = df.copy()
        
        # Standardize column names
        cleaned_df.columns = [col.lower().replace(' ', '_') for col in cleaned_df.columns]
        
        # Remove duplicates
        cleaned_df = cleaned_df.drop_duplicates()
        
        # Handle missing values
        text_columns = cleaned_df.select_dtypes(include=['object']).columns
        for col in text_columns:
            cleaned_df[col] = cleaned_df[col].fillna('Unknown')
        
        numeric_columns = cleaned_df.select_dtypes(include=[np.number]).columns
        for col in numeric_columns:
            cleaned_df[col] = cleaned_df[col].fillna(0)
        
        logger.info(f"Cleaned destination data: {len(cleaned_df)} records")
        return cleaned_df
    
    @staticmethod
    def extract_location_info(text: str) -> Dict[str, str]:
        """Extract location information from text"""
        if not isinstance(text, str):
            return {}
        
        # Simple regex patterns for location extraction
        country_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
        city_pattern = r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'
        
        countries = re.findall(country_pattern, text)
        cities = re.findall(city_pattern, text)
        
        return {
            'potential_countries': countries[:3],  # Top 3 matches
            'potential_cities': cities[:3]
        }
    
    @staticmethod
    def normalize_budget(budget_value: Any) -> float:
        """Normalize budget values to USD"""
        if pd.isna(budget_value) or budget_value == '':
            return 0.0
        
        if isinstance(budget_value, str):
            # Remove currency symbols and convert to float
            cleaned = re.sub(r'[^\d.]', '', budget_value)
            try:
                return float(cleaned)
            except ValueError:
                return 0.0
        
        return float(budget_value)
    
    @staticmethod
    def extract_features_from_text(text: str) -> List[str]:
        """Extract key features from descriptive text"""
        if not isinstance(text, str):
            return []
        
        # Common travel-related keywords
        keywords = [
            'beach', 'mountain', 'city', 'historic', 'cultural', 'adventure',
            'luxury', 'budget', 'family', 'romantic', 'nightlife', 'food',
            'nature', 'wildlife', 'museum', 'art', 'shopping', 'resort',
            'backpacking', 'cruise', 'spa', 'skiing', 'diving', 'hiking'
        ]
        
        text_lower = text.lower()
        found_features = [keyword for keyword in keywords if keyword in text_lower]
        
        return found_features
    
    @staticmethod
    def process_user_preferences(preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Process and normalize user preferences"""
        processed = {}
        
        # Standardize interest categories
        interests = preferences.get('interests', [])
        if isinstance(interests, str):
            interests = [interests]
        
        standardized_interests = []
        for interest in interests:
            if isinstance(interest, str):
                standardized_interests.append(interest.lower().strip())
        
        processed['interests'] = standardized_interests
        
        # Process budget information
        budget = preferences.get('budget', {})
        if isinstance(budget, dict):
            processed['budget_min'] = DataProcessor.normalize_budget(budget.get('min', 0))
            processed['budget_max'] = DataProcessor.normalize_budget(budget.get('max', 10000))
        else:
            processed['budget_min'] = 0
            processed['budget_max'] = DataProcessor.normalize_budget(budget)
        
        # Process travel style
        travel_style = preferences.get('travelStyle', 'balanced')
        processed['travel_style'] = travel_style.lower() if isinstance(travel_style, str) else 'balanced'
        
        # Process accommodation preferences
        accommodation = preferences.get('accommodation', 'comfortable')
        processed['accommodation'] = accommodation.lower() if isinstance(accommodation, str) else 'comfortable'
        
        return processed
    
    @staticmethod
    def calculate_travel_compatibility(user_prefs: Dict[str, Any], 
                                     destination_features: Dict[str, Any]) -> float:
        """Calculate compatibility score between user preferences and destination"""
        score = 0.0
        total_factors = 0
        
        # Interest matching
        user_interests = set(user_prefs.get('interests', []))
        dest_features = set(destination_features.get('features', []))
        
        if user_interests and dest_features:
            interest_overlap = len(user_interests.intersection(dest_features))
            interest_score = interest_overlap / len(user_interests)
            score += interest_score * 0.4
            total_factors += 0.4
        
        # Budget compatibility
        user_budget_max = user_prefs.get('budget_max', 10000)
        dest_avg_cost = destination_features.get('avg_cost', 0)
        
        if dest_avg_cost > 0 and user_budget_max > 0:
            if dest_avg_cost <= user_budget_max:
                budget_score = 1.0 - (dest_avg_cost / user_budget_max) * 0.5
            else:
                budget_score = max(0, 1.0 - (dest_avg_cost - user_budget_max) / user_budget_max)
            
            score += budget_score * 0.3
            total_factors += 0.3
        
        # Travel style compatibility
        user_style = user_prefs.get('travel_style', 'balanced')
        dest_style = destination_features.get('recommended_style', 'balanced')
        
        style_compatibility = {
            ('luxury', 'luxury'): 1.0,
            ('budget', 'budget'): 1.0,
            ('adventure', 'adventure'): 1.0,
            ('relaxation', 'relaxation'): 1.0,
            ('balanced', 'balanced'): 1.0
        }
        
        style_score = style_compatibility.get((user_style, dest_style), 0.5)
        score += style_score * 0.3
        total_factors += 0.3
        
        return score / total_factors if total_factors > 0 else 0.0
    
    @staticmethod
    def process_travel_history(history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process user travel history to extract patterns"""
        if not history:
            return {}
        
        patterns = {
            'total_trips': len(history),
            'avg_budget': np.mean([DataProcessor.normalize_budget(trip.get('budget', 0)) for trip in history]),
            'avg_duration': np.mean([trip.get('duration', 0) for trip in history]),
            'favorite_destinations': [],
            'preferred_months': [],
            'travel_frequency': 0
        }
        
        # Extract destination patterns
        destinations = [trip.get('destination', '') for trip in history]
        destination_counts = pd.Series(destinations).value_counts()
        patterns['favorite_destinations'] = destination_counts.head(5).to_dict()
        
        # Extract seasonal patterns
        travel_dates = []
        for trip in history:
            start_date = trip.get('startDate', '')
            if start_date:
                try:
                    date_obj = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                    travel_dates.append(date_obj.month)
                except:
                    continue
        
        if travel_dates:
            month_counts = pd.Series(travel_dates).value_counts()
            patterns['preferred_months'] = month_counts.head(3).index.tolist()
        
        # Calculate travel frequency (trips per year)
        if len(history) >= 2:
            sorted_history = sorted(history, key=lambda x: x.get('startDate', ''))
            if sorted_history[0].get('startDate') and sorted_history[-1].get('startDate'):
                try:
                    first_trip = datetime.fromisoformat(sorted_history[0]['startDate'].replace('Z', '+00:00'))
                    last_trip = datetime.fromisoformat(sorted_history[-1]['startDate'].replace('Z', '+00:00'))
                    years_span = (last_trip - first_trip).days / 365.25
                    patterns['travel_frequency'] = len(history) / max(years_span, 1)
                except:
                    patterns['travel_frequency'] = len(history)
        
        return patterns
    
    @staticmethod
    def merge_datasets(datasets: List[pd.DataFrame], 
                      join_columns: Optional[List[str]] = None) -> pd.DataFrame:
        """Merge multiple datasets intelligently"""
        if not datasets or all(df.empty for df in datasets):
            return pd.DataFrame()
        
        # Filter out empty datasets
        valid_datasets = [df for df in datasets if not df.empty]
        
        if len(valid_datasets) == 1:
            return valid_datasets[0]
        
        # If join columns are specified, use them for merging
        if join_columns:
            merged_df = valid_datasets[0]
            for df in valid_datasets[1:]:
                common_cols = set(merged_df.columns).intersection(set(df.columns))
                join_cols = [col for col in join_columns if col in common_cols]
                
                if join_cols:
                    merged_df = merged_df.merge(df, on=join_cols, how='outer')
                else:
                    # Concatenate if no common join columns
                    merged_df = pd.concat([merged_df, df], ignore_index=True, sort=False)
        else:
            # Simple concatenation
            merged_df = pd.concat(valid_datasets, ignore_index=True, sort=False)
        
        return merged_df
    
    @staticmethod
    def validate_data_quality(df: pd.DataFrame) -> Dict[str, Any]:
        """Validate data quality and return metrics"""
        if df.empty:
            return {"status": "empty", "issues": ["Dataset is empty"]}
        
        issues = []
        metrics = {}
        
        # Check for missing values
        missing_percentage = (df.isnull().sum() / len(df)) * 100
        high_missing_cols = missing_percentage[missing_percentage > 50].index.tolist()
        
        if high_missing_cols:
            issues.append(f"High missing values in columns: {high_missing_cols}")
        
        metrics['missing_data_percentage'] = missing_percentage.to_dict()
        
        # Check for duplicates
        duplicate_count = df.duplicated().sum()
        if duplicate_count > 0:
            issues.append(f"{duplicate_count} duplicate rows found")
        
        metrics['duplicate_rows'] = duplicate_count
        
        # Check data types
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        text_cols = df.select_dtypes(include=['object']).columns
        
        metrics['column_types'] = {
            'numeric': len(numeric_cols),
            'text': len(text_cols),
            'total': len(df.columns)
        }
        
        # Overall quality score
        quality_score = 100
        quality_score -= len(high_missing_cols) * 10  # -10 for each high missing column
        quality_score -= min(duplicate_count / len(df) * 100, 20)  # -20 max for duplicates
        
        return {
            "status": "good" if quality_score >= 80 else "needs_improvement",
            "quality_score": max(quality_score, 0),
            "issues": issues,
            "metrics": metrics,
            "recommendations": DataProcessor._get_quality_recommendations(issues)
        }
    
    @staticmethod
    def _get_quality_recommendations(issues: List[str]) -> List[str]:
        """Get recommendations for improving data quality"""
        recommendations = []
        
        for issue in issues:
            if "missing values" in issue:
                recommendations.append("Consider data imputation or removal of high-missing columns")
            elif "duplicate" in issue:
                recommendations.append("Remove duplicate rows to improve data quality")
        
        if not recommendations:
            recommendations.append("Data quality looks good!")
        
        return recommendations

