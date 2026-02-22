[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gp9US0IQ)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=22639594&assignment_repo_type=AssignmentRepo)
# QM 2023 Capstone Project

Semester-long capstone for Statistics II: Data Analytics.

## Project Structure
1. Planned Datasets
- Dataset A: Primary Dataset: Lobbying Data
- **File:** data/processed/lobbying_clean.csv
- **Unit of Observation:** firm-year
- **Key Columns:** gvkey, year, lobbying_spend
- **Source:** Senate Lobbying Disclosure Reports (merged with clients.csv for gvkey mapping)
- **Notes:** Aggregated total lobbying expenditures per firm per year; amendments and no-activity filings removed
-
- Dataset B: Pending. Needed to track firm profits. (Revenue, net income, assets, industry, year)


2. Preliminary Research Question 
What is the relationship between firms' lobbying expenditures and their subsequent profitability?



3. Empirical Direction 
Data Prep: Use lobbying_clean.csv for annual firm-level lobbying spending; merge with firm financial data once sourced (Revenue, net income, assets, industry, year)
Analysis: Start with descriptive statistics for lobbying expenditure and profitability; visualize trends over time in average lobbying expenditure; estimate firm and year fixed-effects models to focus on within-firm changes over time
Identification/Strategy: Primary strategy: estimate within-firm associations using firm and year fixed effects, comparing a firm to itself over time
Key Concern: reverse causality (more profitable firms may spend more on lobbying) so include lagged lobbying expenditure as a main specification
Control for confounding factors: firm size, leverage, industry trends, and macro year shocks
Interpret results as associations unless stronger exogenous variation is introduced 


- **code/** — Python scripts and notebooks. Use `config_paths.py` for paths.
- **data/raw/** — Original data (read-only)
- **data/processed/** — Intermediate cleaning outputs
- **data/final/** — M1 output: analysis-ready panel
- **results/figures/** — Visualizations
- **results/tables/** — Regression tables, summary stats
- **results/reports/** — Milestone memos
- **tests/** — Autograding test suite

Run `python code/config_paths.py` to verify paths.
