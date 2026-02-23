# LobbyView Data Download Guide

## Overview
This guide explains how to download the LobbyView Reports Level Dataset for analyzing U.S. lobbying activities.

## ⚠️ Important Notice
LobbyView uses a **JavaScript-based interface** for data downloads, which means automated downloading via direct URLs is **not possible**. You must download the data manually from their website.

## Script: `download_lobbyview_data.py`

### Quick Start

**Check for data and show manual download instructions:**
```bash
cd code
python download_lobbyview_data.py
```

**Show alternative data sources:**
```bash
cd code
python download_lobbyview_data.py --alternatives
```

## Manual Download Steps

1. **Open LobbyView Data Page**
   - Visit: https://www.lobbyview.org/data-download
   
2. **Find Reports Dataset**
   - Look for the "Reports" dataset in the table
   - This is the firm-level lobbying activity data

3. **Download the File**
   - Click the download button/link
   - The file will save to your Downloads folder
   - Typical filename: `reports.csv` or similar

4. **Place in Data Folder**
   - Move the file to: `data/raw/`
   - Rename it to: `lobbyview_reports.csv`

5. **Verify Installation**
   - Run: `python download_lobbyview_data.py`
   - The script will confirm the file is in place

## What's in the Reports Dataset

The **Reports Level Dataset** contains:
- Lobbying expenditure amounts
- Targeted bill identifiers
- Firms involved in lobbying
- Congressional bill correspondence
- Time periods of lobbying activities

## Important Notes

### Why Automated Download Doesn't Work

LobbyView's website uses **JavaScript to dynamically generate download links**. This means:
- Direct HTTP requests don't work
- Simple download scripts cannot access the data
- Manual browser-based download is required

### Alternative Access Methods

If you cannot manually download from the website:

**Option 1: Academic/Institutional Access**
- Contact LobbyView directly at their website
- Check if your institution has a data agreement
- Request special academic access

**Option 2: Alternative Data Sources**
```bash
python download_lobbyview_data.py --alternatives
```

Popular alternatives include:
- **OpenSecrets** - Lobbying expenditure data (https://www.opensecrets.org)
- **Congress.gov API** - Legislative information (https://api.congress.gov)
- **ICPSR** - Archived research datasets
- **Zenodo** - Research data repository

## File Sizes

LobbyView datasets can be large (hundreds of MB). Ensure you have:
- **Adequate disk space** (at least 1-2 GB recommended)
- **Stable internet connection** for download
- **Time** to download (depending on your connection speed)

## Troubleshooting

### "File not found" Error
**Problem:** Script says file is not in `data/raw/`

**Solution:**
1. Visit https://www.lobbyview.org/data-download
2. Download the Reports CSV file
3. Place it in `data/raw/` folder
4. Rename it to `lobbyview_reports.csv`
5. Run the script again

### LobbyView Website Issues
**Problem:** Can't access https://www.lobbyview.org

**Solution:**
- Check your internet connection
- Try again later (server may be temporarily down)
- Consider using alternative data sources
- Contact your institution's IT support if blocked

### Large File Size Issues
**Problem:** Dataset is too large for your disk

**Solution:**
- Ensure you have at least 1-2 GB free space
- Download to an external drive if needed
- Consider filtering data after download
- Use institutional computing resources

## Research Applications

Use LobbyView data for:
- Analyzing how corporate lobbying affects firm performance
- Studying market reactions to lobbying around legislation  
- Investigating political influence patterns across industries
- Examining relationships between lobbying expenditures and policy outcomes
- Analyzing corporate political engagement strategies
- Studying connections between firms and legislators

## Data Citation

When using LobbyView data, please cite:
```
Kim, In Song. 2018. "LobbyView: Firm-level Lobbying & Congressional Bills Database." 
https://www.lobbyview.org
```

## Next Steps

After placing the file in `data/raw/`:

1. **Load the data:**
   ```python
   import pandas as pd
   from config_paths import RAW_DATA_DIR
   
   df = pd.read_csv(RAW_DATA_DIR / 'lobbyview_reports.csv')
   print(f"Loaded {len(df):,} records")
   print(df.head())
   ```

2. **Explore the dataset:**
   ```bash
   python explore_lobbyview_data.py
   ```

3. **Begin your analysis** of corporate lobbying activities

## Support & Resources

- **LobbyView Website:** https://www.lobbyview.org
- **Data Download Page:** https://www.lobbyview.org/data-download
- **Academic Support:** Contact your institution's data librarian
- **Alternative Data:** Check OpenSecrets.org, Congress.gov, or ICPSR


## Script: `download_lobbyview_data.py`

### Quick Start

**Check for data and show manual download instructions:**
```bash
cd code
python download_lobbyview_data.py
```

**Show alternative data sources:**
```bash
cd code
python download_lobbyview_data.py --alternatives
```

### Manual Download Steps

1. **Open LobbyView Data Page**
   - Visit: https://www.lobbyview.org/data-download
   
2. **Find Reports Dataset**
   - Look for the "Reports" dataset in the table
   - This is the firm-level lobbying activity data

3. **Download the File**
   - Click the download button/link
   - The file will save to your Downloads folder
   - Typical filename: `reports.csv` or similar

4. **Place in Data Folder**
   - Move the file to: `data/raw/`
   - Rename it to: `lobbyview_reports.csv`

5. **Verify Installation**
   - Run: `python download_lobbyview_data.py`
   - The script will confirm the file is in place

### What You'll Get

The **Reports Level Dataset** contains:
- Lobbying expenditure amounts
- Targeted bill identifiers
- Firms involved in lobbying
- Congressional bill correspondence
- Time periods of lobbying activities

### Output Location
- Default: `data/raw/lobbyview_reports.csv`
- Custom: Use `--output /path/to/directory`

## Important Notes

### Why Automated Download Doesn't Work

LobbyView's website uses **JavaScript to dynamically generate download links**. This means:
- Direct HTTP requests don't work
- API endpoints are not publicly available
- Manual browser-based download is required

### Alternative Access Methods

If you cannot manually download from the website:

**Option 1: Academic/Institutional Access**
- Contact LobbyView directly at their website
- Check if your institution has a data agreement
- Request special academic access

**Option 2: Alternative Data Sources**
```bash
python download_lobbyview_data.py --alternatives
```

Popular alternatives include:
- **OpenSecrets** - Lobbying expenditure data
- **Congress.gov API** - Legislative information
- **ICPSR** - Archived research datasets
- **Zenodo** - Research data repository

## File Sizes

LobbyView datasets can be large (hundreds of MB). Ensure you have:
- **Adequate disk space** (at least 1-2 GB recommended)
- **Stable internet connection** for download
- **Time** to download (depending on your connection speed)

## Research Applications

Use LobbyView data for:
- Analyzing corporate lobbying effects on firm performance
- Studying market reactions to lobbying around legislation
- Investigating political influence patterns across industries
- Examining relationships between lobbying expenditures and policy outcomes

## Troubleshooting

### Download Fails
1. Check internet connection
2. Verify URLs at https://www.lobbyview.org/data-download
3. Check if LobbyView site is accessible
4. Ensure sufficient disk space

### Import Errors
```bash
# Install missing dependencies
pip install requests tqdm
```

### Permission Errors
```bash
# Ensure data/raw directory is writable
chmod +w data/raw
```

## File Sizes

LobbyView datasets can be large (hundreds of MB). Ensure you have:
- **Adequate disk space** (at least 1-2 GB recommended)
- **Stable internet connection** for download
- **Time** to download (depending on your connection speed)

## Research Applications

Use LobbyView data for:
- Analyzing how corporate lobbying affects firm performance
- Studying market reactions to lobbying around legislation
- Investigating political influence patterns across industries
- Examining relationships between lobbying expenditures and policy outcomes
- Analyzing corporate political engagement strategies

## Data Citation

When using LobbyView data, please cite:
```
Kim, In Song. 2018. "LobbyView: Firm-level Lobbying & Congressional Bills Database." 
https://www.lobbyview.org
```

## Next Steps

After placing the file in `data/raw/`:

1. **Load the data:**
   ```python
   import pandas as pd
   from config_paths import RAW_DATA_DIR
   
   df = pd.read_csv(RAW_DATA_DIR / 'lobbyview_reports.csv')
   ```

2. **Explore the dataset:**
   ```bash
   python explore_lobbyview_data.py
   ```

3. **Begin your analysis** of corporate lobbying activities

## Support & Resources

- **LobbyView Website:** https://www.lobbyview.org
- **Data Download Page:** https://www.lobbyview.org/data-download
- **Academic Support:** Contact your institution's data librarian
- **LobbyView Support:** Check their website for contact information
