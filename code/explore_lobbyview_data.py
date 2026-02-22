"""
LobbyView Reports Dataset - Quick Analysis Example
===================================================

This script demonstrates how to load and explore the LobbyView Reports
dataset after downloading it.
"""

import pandas as pd
import numpy as np
from config_paths import RAW_DATA_DIR, PROCESSED_DATA_DIR
from pathlib import Path

# ==============================================================================
# LOAD DATA
# ==============================================================================

def load_lobbyview_reports():
    """Load the LobbyView Reports dataset."""
    file_path = RAW_DATA_DIR / 'lobbyview_reports.csv'
    
    if not file_path.exists():
        print(f"ERROR: File not found: {file_path}")
        print("\nPlease run the download script first:")
        print("  python download_lobbyview_data.py")
        return None
    
    print(f"Loading data from: {file_path}")
    df = pd.read_csv(file_path)
    print(f"✓ Loaded {len(df):,} rows and {len(df.columns)} columns")
    
    return df


# ==============================================================================
# BASIC EXPLORATION
# ==============================================================================

def explore_dataset(df):
    """Perform basic exploration of the dataset."""
    
    if df is None:
        return
    
    print("\n" + "="*70)
    print("DATASET OVERVIEW")
    print("="*70)
    
    # Dataset shape
    print(f"\nRows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")
    
    # Column names
    print("\n" + "-"*70)
    print("COLUMNS")
    print("-"*70)
    for i, col in enumerate(df.columns, 1):
        print(f"{i:2d}. {col}")
    
    # Data types
    print("\n" + "-"*70)
    print("DATA TYPES")
    print("-"*70)
    print(df.dtypes)
    
    # Missing values
    print("\n" + "-"*70)
    print("MISSING VALUES")
    print("-"*70)
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    missing_df = pd.DataFrame({
        'Missing Count': missing,
        'Missing %': missing_pct
    })
    print(missing_df[missing_df['Missing Count'] > 0].sort_values('Missing Count', ascending=False))
    
    # First few rows
    print("\n" + "-"*70)
    print("FIRST 5 ROWS")
    print("-"*70)
    print(df.head())
    
    # Summary statistics
    print("\n" + "-"*70)
    print("SUMMARY STATISTICS")
    print("-"*70)
    print(df.describe())
    
    # Memory usage
    print("\n" + "-"*70)
    print("MEMORY USAGE")
    print("-"*70)
    memory_mb = df.memory_usage(deep=True).sum() / (1024**2)
    print(f"Total memory: {memory_mb:.2f} MB")


# ==============================================================================
# EXAMPLE ANALYSES
# ==============================================================================

def example_lobbying_analysis(df):
    """
    Example analysis of lobbying data.
    Customize this based on the actual columns in your dataset.
    """
    
    if df is None:
        return
    
    print("\n" + "="*70)
    print("EXAMPLE LOBBYING ANALYSIS")
    print("="*70)
    
    # Example analyses - adjust based on actual column names
    # These are common columns in LobbyView Reports dataset:
    
    # 1. Top lobbying firms by expenditure (if 'amount' column exists)
    if 'amount' in df.columns:
        print("\n1. Total Lobbying Expenditures")
        print("-" * 40)
        total_spending = df['amount'].sum()
        print(f"Total lobbying expenditure: ${total_spending:,.2f}")
        print(f"Average per report: ${df['amount'].mean():,.2f}")
        print(f"Median per report: ${df['amount'].median():,.2f}")
    
    # 2. Top registrants (if 'registrant_name' column exists)
    if 'registrant_name' in df.columns:
        print("\n2. Top 10 Lobbying Registrants")
        print("-" * 40)
        top_registrants = df['registrant_name'].value_counts().head(10)
        print(top_registrants)
    
    # 3. Lobbying over time (if year/date column exists)
    if 'year' in df.columns:
        print("\n3. Lobbying Activity by Year")
        print("-" * 40)
        yearly = df.groupby('year').size().sort_index()
        print(yearly)
    
    # 4. Industry analysis (if industry column exists)
    if 'client_category' in df.columns or 'industry' in df.columns:
        industry_col = 'client_category' if 'client_category' in df.columns else 'industry'
        print(f"\n4. Top 10 Industries/Categories")
        print("-" * 40)
        top_industries = df[industry_col].value_counts().head(10)
        print(top_industries)
    
    print("\n" + "="*70)
    print("NOTE: Customize this analysis based on your research questions!")
    print("="*70)


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    # Load the data
    print("="*70)
    print("LOBBYVIEW REPORTS DATASET EXPLORATION")
    print("="*70)
    
    df = load_lobbyview_reports()
    
    # Explore the dataset
    explore_dataset(df)
    
    # Run example analysis
    example_lobbying_analysis(df)
    
    # Save a sample for quick testing (optional)
    if df is not None:
        sample_file = PROCESSED_DATA_DIR / 'lobbyview_reports_sample.csv'
        sample_size = min(1000, len(df))
        df.sample(sample_size, random_state=42).to_csv(sample_file, index=False)
        print(f"\n✓ Saved {sample_size}-row sample to: {sample_file}")
