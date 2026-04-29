[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gp9US0IQ)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=22639594&assignment_repo_type=AssignmentRepo)
# QM 2023 Capstone Project

Semester-long capstone for Statistics II: Data Analytics.

Team Members: Alycia Reji, Gracie Vivion, Shelby Howard, and Daniz Mammadova

## Project Structure
1. Planned Datasets
- Dataset A: Primary Dataset: Lobbying Data

- **File:** data/processed/lobbying_clean.csv
- **Unit of Observation:** firm-year
- **Key Columns:** gvkey, year, lobbying_spend
- **Source:** Senate Lobbying Disclosure Reports (merged with clients.csv for gvkey mapping)
- **Notes:** Aggregated total lobbying expenditures per firm per year; amendments and no-activity filings removed

- Dataset B: Firm Financials

- **File:** data/processed/financials_clean.csv
- **Unit of Observation:** firm-year 
- **Source**: SEC XBRL quarterly filings (Q4 2010–2020)
- **Key Columns:** cik, name, year, Assets, NetIncomeLoss, Revenues
- **Purpose:** Track firm profitability and other financial metrics
- **Notes**: 
  - Only 10-K filings were included
  - Only USD values retained
  - Merged with lobbying_clean.csv on year for Milestone 1
  - A proper firm-level merge (gvkey ↔ cik) will be done in later analysis
- **Constructed:** ROA = NetIncomeLoss / Assets

- **Merging Strategy:**
  - Created CIK-GVKEY Crosswalk (cik_gvkey_crosswalk.csv)
  - Merged lobbying and financials by firm identifier and year
  - Created:
    - merged_financials_lobbying_balanced.csv
    - merged_financials_lobbying.csv

- **Outputs:**
  - Visualizations in /reports/figures
  - Clean data panel dataset in /data/final


2. Preliminary Research Question 
**What is the relationship between firms' lobbying expenditures and their subsequent profitability?**



3. Empirical Direction 
Data Prep: Use lobbying_clean.csv for annual firm-level lobbying spending; merge with firm financial data once sourced (Revenue, net income, assets, industry, year)
Analysis: Start with descriptive statistics for lobbying expenditure and profitability; visualize trends over time in average lobbying expenditure; estimate firm and year fixed-effects models to focus on within-firm changes over time
Identification/Strategy: Primary strategy: estimate within-firm associations using firm and year fixed effects, comparing a firm to itself over time
Key Concern: reverse causality (more profitable firms may spend more on lobbying) so include lagged lobbying expenditure as a main specification
Control for confounding factors: firm size, leverage, industry trends, and macro year shocks
Interpret results as associations unless stronger exogenous variation is introduced 


## How to Reproduce the Data Pipeline:

This project constructs a firm-year panel dataset linking firm lobbying expenditures to financial performance using SEC financial statement data.

All scripts should be run from the project root directory.

Quick run order:
```bash
python code/build_financials.py
python code/fetch_lobbying_data.py
python code/create_crosswalk_and_merge.py
python code/filter_balanced_panel.py
python code/generate_quality_report.py
```

1. Install Required Packages

Install the necessary Python packages:
```bash
pip install pandas numpy statsmodels matplotlib requests
```

2. Build Financial Dataset (SEC Data)

Construct the cleaned firm-year financial dataset from SEC Q4 filings (2010–2020):
```bash
python code/build_financials.py
```
This script:
- Processes SEC financial statement data
- Extracts Assets, NetIncomeLoss, and Revenues
- Aggregates to the firm-year level
Output:
`data/processed/financials_clean.csv`

3. Build Lobbying Dataset

Construct firm-year lobbying expenditure totals:
```bash
python code/fetch_lobbying_data.py
```
This script:
- Aggregates lobbying reports to the firm-year level
Output:
`data/processed/lobbying_clean.csv`

4. Create CIK–GVKEY Crosswalk and Merge Datasets

Merge financial and lobbying data:
```bash
python code/create_crosswalk_and_merge.py
```
This script:
- Builds a CIK–GVKEY crosswalk using company name matching
- Merges financials and lobbying data
- Constructs Return on Assets (ROA):
  $ROA = NetIncomeLoss / Assets$
Outputs:
`data/processed/cik_gvkey_crosswalk.csv`  
`data/final/merged_financials_lobbying.csv`

5. Create Balanced Panel (Optional)

Restrict the dataset to firms with complete data for all years 2010–2020:
```bash
python code/filter_balanced_panel.py
```
Output:
`data/final/merged_financials_lobbying_balanced.csv`

6. Generate Data Quality Report

Create a polished data quality summary from current pipeline outputs:
```bash
python code/generate_quality_report.py
```
Output:
`results/reports/quality_report.md`

7. Generate M3 Econometric Results and Robustness Checks

Run the main econometric script to produce the fixed-effects results, lag-structure comparison, standard-vs-clustered SE comparison, outlier-period exclusion, subgroup robustness tables, and bonus specifications (three-way FE, modern DiD, cluster bootstrap):
```bash
python code/capstone_models.py
```
Key outputs:
`results/tables/M3_fixed_effects_table.txt`
`results/tables/M3_standard_vs_clustered_table.txt`
`results/tables/M3_lag_robustness_table.txt`
`results/tables/M3_robustness_checks.csv`
`results/tables/M3_robustness_checks.txt`
`results/reports/M3_robustness_checks.txt`
`results/tables/M3_bonus_three_way_fe_coefficients.csv`
`results/tables/M3_bonus_did_attgt.csv`
`results/tables/M3_bonus_did_event_study.csv`
`results/tables/M3_bonus_did_size_heterogeneity.csv`
`results/tables/M3_bonus_bootstrap_clustered.csv`
`results/reports/M3_interpretation.md`

Required policy file for M3 submission:
`AI_AUDIT_APPENDIX.md`

## EDA Reproducibility (capstone_eda.ipynb)

The EDA notebook reads:
- `data/final/merged_financials_lobbying.csv`

and writes figures to:
- `results/figures/`

### Option A: Full reproducible run (from scripts + notebook)

Run from project root:

```bash
pip install -r requirements.txt
python code/build_financials.py
python code/fetch_lobbying_data.py
python code/create_crosswalk_and_merge.py
python code/filter_balanced_panel.py
python code/generate_quality_report.py
python -m jupyter nbconvert --to notebook --execute capstone_eda.ipynb --output /tmp/capstone_eda_executed.ipynb
```

### Option B: Notebook-only run (if final data already exists)

```bash
pip install -r requirements.txt
python -m jupyter nbconvert --to notebook --execute capstone_eda.ipynb --output /tmp/capstone_eda_executed.ipynb
```

If execution succeeds, the fully executed notebook is saved at:
- `/tmp/capstone_eda_executed.ipynb`

Project Structure
data/
  raw/          # Original datasets
  processed/    # Clean intermediate datasets
  final/        # Final merged panel datasets

code/           # Reproducible scripts

results/
  figures/      # Visualizations

**Hypotheses:**
This project tests the following hypotheses:
  H1: Firms that spend more on lobbying have higher profitability (ROA).
  H2: Lobbying expenditures predict higher future profitability (lagged effect).
  H3: More profitable firms spend more on lobbying (reverse causality test).
  H4: The returns to lobbying exhibit diminishing marginal effects.
These hypotheses allow us to examine both the direction and the economic mechanism underlying the lobbying–profitability relationship.


- **code/** — Python scripts and notebooks. Use `config_paths.py` for paths.
- **data/raw/** — Original data (read-only)
- **data/processed/** — Intermediate cleaning outputs
- **data/final/** — M1 output: analysis-ready panel
- **results/figures/** — Visualizations
- **results/tables/** — Regression tables, summary stats
- **results/reports/** — Milestone memos
- **tests/** — Autograding test suite

Run `python code/config_paths.py` to verify paths.
