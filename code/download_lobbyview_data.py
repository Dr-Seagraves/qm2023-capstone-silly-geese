"""
Download LobbyView Reports Level Dataset
==========================================

This script downloads the Reports Level Dataset from LobbyView.org
into the data/raw folder.

LobbyView provides comprehensive data on U.S. lobbying activities including:
- Lobbying expenditure amounts
- Targeted bill identifiers  
- Firms involved in lobbying
- Congressional bills correspondence

Source: https://www.lobbyview.org/data-download

NOTE: LobbyView uses a JavaScript-based interface for data downloads.
You have several options:
1. Manual download from https://www.lobbyview.org/data-download
2. Use this script to check for alternative data sources
3. Access through academic/institutional agreements
"""

import requests
import os
import json
from pathlib import Path
from tqdm import tqdm
from config_paths import RAW_DATA_DIR

# ==============================================================================
# LOBBYVIEW DATA INFORMATION
# ==============================================================================

# LobbyView Website
LOBBYVIEW_WEBSITE = "https://www.lobbyview.org"
LOBBYVIEW_DOWNLOAD_PAGE = "https://www.lobbyview.org/data-download"

# NOTE: LobbyView currently uses a JavaScript-based download interface
# Direct CSV links are not available via simple HTTP requests
# The following URLs are for reference and may require manual download:
LOBBYVIEW_URLS = {
    'reports': f'{LOBBYVIEW_WEBSITE}/data/reports.csv',
    'issues': f'{LOBBYVIEW_WEBSITE}/data/issues.csv',
    'bills': f'{LOBBYVIEW_WEBSITE}/data/bills.csv',
    'clients': f'{LOBBYVIEW_WEBSITE}/data/clients.csv',
    'networks': f'{LOBBYVIEW_WEBSITE}/data/networks.csv',
}

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

def manual_download_instructions():
    """
    Print instructions for manually downloading LobbyView data.
    """
    print("\n" + "="*70)
    print("MANUAL DOWNLOAD INSTRUCTIONS")
    print("="*70)
    print("""
LobbyView uses a JavaScript-based interface for data downloads.
To download the Reports Level Dataset:

1. Open: https://www.lobbyview.org/data-download
2. Find the "Reports" dataset in the table
3. Click the download button/link
4. Save the CSV file to your Downloads folder
5. Move it to: /workspaces/qm2023-capstone-silly-geese/data/raw/
6. Rename it to: lobbyview_reports.csv

Alternatively:
- Contact LobbyView directly for data access
- Check if your institution has a data agreement with LobbyView
- Look for the dataset through ICPSR or other data repositories

File placement:
You can also directly place the CSV file in the data/raw folder
and this script will recognize it.
""")
    print("="*70)


def verify_manual_download():
    """
    Check if LobbyView reports file exists in raw data folder.
    Accepts various common naming conventions.
    """
    raw_dir = Path(RAW_DATA_DIR)
    
    # Check for various possible filenames
    possible_names = [
        'lobbyview_reports.csv',
        'reports.csv',
        'lobbyview_reports_level.csv',
        'LobbyView_reports.csv',
    ]
    
    for filename in possible_names:
        file_path = raw_dir / filename
        if file_path.exists():
            print(f"\n✓ Found LobbyView reports file: {filename}")
            print(f"  Location: {file_path}")
            print(f"  Size: {file_path.stat().st_size / (1024*1024):.2f} MB")
            return file_path
    
    return None


def check_for_kaggle_alternative():
    """
    Provide information about alternative sources for lobbying data.
    """
    print("\n" + "="*70)
    print("ALTERNATIVE DATA SOURCES")
    print("="*70)
    print("""
If you cannot access LobbyView directly, consider these alternatives:

1. **OpenSecrets (Center for Responsive Politics)**
   - URL: https://www.opensecrets.org
   - Data: Lobbying expenditure data
   
2. **Congress.gov API**
   - URL: https://api.congress.gov
   - Data: Congressional bills and legislative data
   
3. **Data repositories (ICPSR, Zenodo)**
   - Search for "lobbying" datasets
   - Look for academic publications that share their data
   
4. **Direct contact with LobbyView**
   - Email support at LobbyView.org
   - Ask about data download access
   - Inquire about institutional agreements
""")

def download_file(url, output_path, chunk_size=8192):
    """
    Download a file from a URL with progress bar.
    
    Parameters:
    -----------
    url : str
        URL to download from
    output_path : Path or str
        Path where file will be saved
    chunk_size : int
        Size of chunks to download at a time (bytes)
    
    Returns:
    --------
    bool
        True if download successful, False otherwise
    """
    try:
        print(f"\nDownloading from: {url}")
        print(f"Saving to: {output_path}")
        
        # Send GET request with stream=True to download in chunks
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        # Get total file size if available
        total_size = int(response.headers.get('content-length', 0))
        
        # Create output directory if it doesn't exist
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Download with progress bar
        with open(output_path, 'wb') as f:
            if total_size == 0:
                # No content-length header, download without progress bar
                f.write(response.content)
                print("✓ Download complete (size unknown)")
            else:
                # Download with progress bar
                with tqdm(total=total_size, unit='B', unit_scale=True, 
                         desc=output_path.name) as pbar:
                    for chunk in response.iter_content(chunk_size=chunk_size):
                        if chunk:
                            f.write(chunk)
                            pbar.update(len(chunk))
                
                print(f"✓ Download complete: {output_path.name}")
                print(f"  Size: {total_size / (1024*1024):.2f} MB")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Error downloading file: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False


def download_lobbyview_reports(output_dir=None):
    """
    Attempt to download the LobbyView Reports Level Dataset.
    
    Note: Due to LobbyView's JavaScript-based interface, automated
    downloads may not work. This function provides guidance for
    manual download instead.
    
    Parameters:
    -----------
    output_dir : Path or str, optional
        Directory to save the file. Defaults to RAW_DATA_DIR.
    
    Returns:
    --------
    Path or None
        Path to file if found/downloaded, None otherwise
    """
    if output_dir is None:
        output_dir = RAW_DATA_DIR
    
    output_dir = Path(output_dir)
    
    print("="*70)
    print("LOBBYVIEW REPORTS LEVEL DATASET")
    print("="*70)
    
    # First, check if file already exists (manually placed)
    existing_file = verify_manual_download()
    if existing_file:
        return existing_file
    
    # Try to download (will likely fail, but worth attempting)
    output_file = output_dir / 'lobbyview_reports.csv'
    print(f"\nAttempting to download from: {LOBBYVIEW_DOWNLOAD_PAGE}")
    
    try:
        response = requests.get(LOBBYVIEW_URLS['reports'], timeout=10)
        response.raise_for_status()
        
        with open(output_file, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Download successful!")
        return output_file
        
    except requests.exceptions.RequestException as e:
        print(f"\n⚠ Automated download failed: {e}")
        print("\nThis is expected - LobbyView uses JavaScript-based downloads.")
        print("Please use the manual download method instead.")
    
    # Show manual download instructions
    manual_download_instructions()
    
    return None


def download_all_lobbyview_datasets(output_dir=None):
    """
    Download all available LobbyView datasets.
    
    Parameters:
    -----------
    output_dir : Path or str, optional
        Directory to save files. Defaults to RAW_DATA_DIR.
    
    Returns:
    --------
    dict
        Dictionary mapping dataset names to file paths
    """
    if output_dir is None:
        output_dir = RAW_DATA_DIR
    
    output_dir = Path(output_dir)
    downloaded_files = {}
    
    print("="*70)
    print("DOWNLOADING ALL LOBBYVIEW DATASETS")
    print("="*70)
    
    for dataset_name, url in LOBBYVIEW_URLS.items():
        output_file = output_dir / f'lobbyview_{dataset_name}.csv'
        
        print(f"\n[{dataset_name.upper()}]")
        success = download_file(url, output_file)
        
        if success and output_file.exists():
            downloaded_files[dataset_name] = output_file
        else:
            print(f"  ⚠ Skipping {dataset_name} due to download error")
    
    print(f"\n{'='*70}")
    print(f"✓ Downloaded {len(downloaded_files)}/{len(LOBBYVIEW_URLS)} datasets")
    print(f"{'='*70}")
    
    return downloaded_files


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Download or verify LobbyView datasets',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Check for LobbyView data and show manual download instructions
  python download_lobbyview_data.py
  
  # Show alternative data sources
  python download_lobbyview_data.py --alternatives
  
  # Show manual download instructions
  python download_lobbyview_data.py --manual
        """
    )
    
    parser.add_argument(
        '--manual', 
        action='store_true',
        help='Show manual download instructions'
    )
    
    parser.add_argument(
        '--alternatives',
        action='store_true',
        help='Show alternative data sources'
    )
    
    parser.add_argument(
        '--output', '-o',
        type=str,
        default=None,
        help=f'Output directory (default: {RAW_DATA_DIR})'
    )
    
    args = parser.parse_args()
    
    if args.manual:
        manual_download_instructions()
    elif args.alternatives:
        check_for_kaggle_alternative()
    else:
        # Main workflow
        result = download_lobbyview_reports(output_dir=args.output)
        
        if result is None:
            print("\n" + "="*70)
            print("NEXT STEPS")
            print("="*70)
            print("""
To proceed:
1. Visit: https://www.lobbyview.org/data-download
2. Download the Reports dataset
3. Place the CSV file in: data/raw/
4. Rename it to: lobbyview_reports.csv

Or use alternative data sources:
  python download_lobbyview_data.py --alternatives
""")
