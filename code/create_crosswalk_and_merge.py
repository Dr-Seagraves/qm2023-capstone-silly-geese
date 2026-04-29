"""
Create CIK-GVKEY crosswalk and merge datasets.
Uses fuzzy name matching and SEC Edgar data to link the two datasets.
"""

import pandas as pd
import numpy as np
import requests
import xml.etree.ElementTree as ET
from urllib.parse import urlencode
import time
import re

def normalize_name(name):
    """Normalize company name for matching."""
    if pd.isna(name):
        return ''
    name = str(name).lower().strip()
    # Remove common suffixes
    name = re.sub(r'\s*(inc|corp|corporation|ltd|limited|llc|co|company|group|holding|holdings|systems|technologies|services|international|usa|usa\.?|/de/|\\de\\).*$', '', name)
    # Remove punctuation
    name = re.sub(r'[^a-z0-9\s]', '', name)
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name)
    return name.strip()

def similar_names(name1, name2, threshold=0.7):
    """Check if names are similar using simple substring/word matching."""
    norm1 = normalize_name(name1)
    norm2 = normalize_name(name2)
    
    if not norm1 or not norm2:
        return False
    
    # Exact match after normalization
    if norm1 == norm2:
        return True
    
    # Check if one contains the other
    words1 = set(norm1.split())
    words2 = set(norm2.split())
    
    if not words1 or not words2:
        return False
    
    # Jaccard similarity
    intersection = len(words1 & words2)
    union = len(words1 | words2)
    
    if union == 0:
        return False
    
    similarity = intersection / union
    return similarity >= threshold

def fetch_sec_cik_data(max_companies=None):
    """
    Fetch CIK data from SEC EDGAR.
    Returns a dataframe with cik, company_name, ticker
    """
    print("Fetching CIK data from SEC EDGAR...")
    
    try:
        # SEC provides a searchable browse interface
        # We'll parse the XML response
        params = {
            'action': 'getcompany',
            'company_type': '',
            'State': '',
            'Country': '',
            'output': 'xml',
            'count': '100'  # Start with 100, can paginate
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        url = 'https://www.sec.gov/cgi-bin/browse-edgar'
        response = requests.get(url, params=params, timeout=10, headers=headers)
        
        if response.status_code == 200:
            print(f"✓ Downloaded {len(response.text)} bytes from SEC")
            # Parse XML
            try:
                root = ET.fromstring(response.text)
                companies = []
                
                for doc in root.findall('.//doc'):
                    cik_elem = doc.find('cik')
                    company_elem = doc.find('company')
                    ticker_elem = doc.find('ticker')
                    
                    if cik_elem is not None:
                        companies.append({
                            'cik': int(cik_elem.text),
                            'company_name': company_elem.text if company_elem is not None else '',
                            'ticker': ticker_elem.text if ticker_elem is not None else ''
                        })
                
                if companies:
                    sec_df = pd.DataFrame(companies)
                    print(f"  Loaded {len(sec_df)} companies from SEC")
                    return sec_df
            except Exception as e:
                print(f"  Could not parse SEC XML: {e}")
        else:
            print(f"  SEC returned status: {response.status_code}")
    
    except Exception as e:
        print(f"  Error fetching from SEC: {e}")
    
    return None

def build_crosswalk_from_names(financials_df, lobbying_df, clients_df):
    """
    Build CIK-GVKEY crosswalk by fuzzy matching company names.
    """
    print("\n" + "="*70)
    print("BUILDING CIK-GVKEY CROSSWALK")
    print("="*70)
    
    # Get unique companies from each dataset
    fin_companies = financials_df[['cik', 'name']].drop_duplicates().reset_index(drop=True)
    
    # Get company names from lobbying data (via clients)
    clients_companies = clients_df[['gvkey', 'client_name']].drop_duplicates()
    clients_companies = clients_companies[clients_companies['gvkey'].notna()].reset_index(drop=True)
    
    print(f"\nFinancials companies: {len(fin_companies)}")
    print(f"Lobbying companies (from clients): {len(clients_companies)}")
    
    # Create lookup dictionaries for speed
    clients_dict = {}
    for idx, row in clients_companies.iterrows():
        if pd.notna(row['gvkey']) and pd.notna(row['client_name']):
            clients_dict[normalize_name(row['client_name'])] = row['gvkey']
    
    print(f"Normalized unique client names: {len(clients_dict)}")
    
    # Try to match based on names
    matches = []
    
    for idx, row in fin_companies.iterrows():
        if idx % 500 == 0:
            print(f"  Processing: {idx}/{len(fin_companies)}...")
        
        cik_val = row['cik']
        fin_name = row['name']
        
        # Skip if name is missing
        if pd.isna(fin_name) or fin_name == '':
            continue
        
        norm_fin_name = normalize_name(fin_name)
        
        # Only use exact matches
        if norm_fin_name in clients_dict:
            matches.append({
                'cik': cik_val,
                'fin_name': fin_name,
                'gvkey': clients_dict[norm_fin_name],
                'match_type': 'exact'
            })
    
    crosswalk = pd.DataFrame(matches)
    print(f"\nMatches found: {len(crosswalk)}")
    
    if len(crosswalk) > 0:
        match_types = crosswalk['match_type'].value_counts()
        print(f"Match types: {match_types.to_dict()}")
        print("\nSample matches:")
        print(crosswalk.head(10)[['cik', 'fin_name', 'gvkey', 'match_type']].to_string())
    
    return crosswalk

def merge_datasets(financials_df, lobbying_df, crosswalk_df):
    """
    Merge financials and lobbying datasets using the crosswalk.
    """
    print("\n" + "="*70)
    print("MERGING DATASETS")
    print("="*70)
    
    # Add gvkey to financials using crosswalk
    financials_with_gvkey = financials_df.merge(
        crosswalk_df[['cik', 'gvkey']],
        on='cik',
        how='left'
    )
    
    print(f"\nFinancials with GVKEY matched: {financials_with_gvkey['gvkey'].notna().sum()} rows")
    print(f"Financials rows: {len(financials_with_gvkey)}")
    
    # Merge with lobbying data
    merged = financials_with_gvkey.merge(
        lobbying_df[['year', 'lobbying_spend', 'gvkey']],
        on=['gvkey', 'year'],
        how='left'
    )
    
    print(f"\nAfter merging with lobbying data: {len(merged)} rows")
    print(f"Rows with lobbying data: {merged['lobbying_spend'].notna().sum()}")
    print(f"Rows without lobbying data: {merged['lobbying_spend'].isna().sum()}")
    
    print("\nDataset shape:", merged.shape)
    print("Columns:", merged.columns.tolist())
    
    return merged

def main():
    # Load datasets
    print("Loading datasets...")
    financials = pd.read_csv('/workspaces/qm2023-capstone-silly-geese/data/processed/financials_clean.csv')
    lobbying = pd.read_csv('/workspaces/qm2023-capstone-silly-geese/data/processed/lobbying_clean.csv')
    clients = pd.read_csv('/workspaces/qm2023-capstone-silly-geese/data/raw/clients.csv')
    
    print(f"✓ Loaded {len(financials)} financials records")
    print(f"✓ Loaded {len(lobbying)} lobbying records")
    print(f"✓ Loaded {len(clients)} client records")
    
    # Build crosswalk
    crosswalk = build_crosswalk_from_names(financials, lobbying, clients)
    
    # Save crosswalk
    crosswalk_path = '/workspaces/qm2023-capstone-silly-geese/data/processed/cik_gvkey_crosswalk.csv'
    crosswalk[['cik', 'gvkey']].to_csv(crosswalk_path, index=False)
    print(f"\n✓ Saved crosswalk to {crosswalk_path}")
    
    # Merge datasets
    merged = merge_datasets(financials, lobbying, crosswalk)
    
    # -----------------------------------
    # Create ROA (Return on Assets)
    # -----------------------------------
    merged["roa"] = merged["NetIncomeLoss"] / merged["Assets"]

    # Optional: avoid division by zero
    merged.loc[merged["Assets"] == 0, "roa"] = np.nan

    # -----------------------------------
    # Save merged dataset
    # -----------------------------------
    merged_path = '/workspaces/qm2023-capstone-silly-geese/data/final/merged_financials_lobbying.csv'
    merged.to_csv(merged_path, index=False)

    print("✓ ROA created")
    
    print("\n" + "="*70)
    print("DONE!")
    print("="*70)
    print(f"\nMerged dataset has {len(merged)} rows")
    print(f"Columns: {merged.columns.tolist()}")
    
    return merged, crosswalk

if __name__ == '__main__':
    merged, crosswalk = main()
