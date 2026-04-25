# AI Audit Appendix

This file documents how AI tools were used during the project, what was generated, and how outputs were verified by humans.

## Purpose

This appendix documents how AI tools were used throughout the project to support coding, data processing, and econometric analysis. The goal is to ensure transparency in how AI contributed to the workflow while maintaining academic integrity.

AI was primarily used to assist with:
- Structuring Python scripts and improving code efficiency  
- Implementing econometric models and diagnostic tests  
- Debugging errors and refining workflow in GitHub Codespaces  
- Generating draft documentation and improving clarity of explanations  

All AI-generated outputs were reviewed, tested, and adjusted by team members before being accepted. The final results, model decisions, and interpretations reflect the team’s own understanding and validation.

AI tools were integrated into the GitHub workflow to support iterative development, allowing the team to test, refine, and validate outputs directly within the coding environment.

## AI Tools Used

- GitHub Copilot: Integrated into VS Code for real-time code suggestions, debugging assistance, and generating boilerplate code for Python scripts related to data processing and analysis. 

## Usage Principles

- AI suggestions are treated as drafts, not final authority.
- All AI-generated outputs are reviewed and edited by a team member.
- Numerical claims and dataset logic are checked against source files/scripts.
- Sensitive or restricted data should not be pasted into external AI systems.

## Audit Entries

Use one entry per substantial AI-assisted action.

### Entry Template

- **Date:** YYYY-MM-DD
- **Team Member:** Name
- **Task:** What was being done
- **AI Prompt (summary):** Short description of request
- **AI Output (summary):** What AI produced
- **Files Affected:** List paths
- **Validation Performed:** Tests/checks/human review completed
- **Edits After AI:** What was changed manually
- **Status:** Accepted / Accepted with changes / Rejected
- **Notes:** Limitations, concerns, or follow-up

---

### Entry 1

- **Date:** 2026-02-26
- **Team Member:** Project team (via VS Code Copilot session)
- **Task:** Create a final dataset data dictionary
- **AI Prompt (summary):** "help me add a data_dictionary.md to data/final/"
- **AI Output (summary):** Generated a new markdown dictionary describing final datasets, column definitions, and missingness notes
- **Files Affected:**
  - `data/final/data_dictionary.md`
- **Validation Performed:**
  - Confirmed columns from final CSV headers (`merged_financials_lobbying.csv` and `merged_financials_lobbying_balanced.csv`)
  - Confirmed balanced-panel logic from `code/filter_balanced_panel.py`
  - Confirmed ROA construction from `code/create_crosswalk_and_merge.py`
- **Edits After AI:** None logged yet
- **Status:** Accepted with changes pending team review
- **Notes:** Keep this audit updated if definitions or pipeline logic change

### Entry 2

- **Date:** 2026-02-26
- **Team Member:** Project team (via VS Code Copilot session)
- **Task:** Initialize AI audit tracking document
- **AI Prompt (summary):** "help me generate a file titled AI_Audit.md"
- **AI Output (summary):** Created this audit file with policy, template, and initial entries
- **Files Affected:**
  - `AI_Audit.md`
- **Validation Performed:**
  - Verified file creation at repository root
  - Reviewed section structure for project fit
- **Edits After AI:** None
- **Status:** Accepted
- **Notes:** Add entries continuously for future AI-assisted tasks

### Entry 3

- **Date:** 2026-02-22
- **Team Member:** Shelby Howard
- **Task:** Uploading raw SEC Q4s from 2010-2020
- **AI Prompt (summary):** "Help me download Q4 financials from the SEC for years 2010-2020"
- **AI Output (summary):** Created a python code and downloaded raw data to the raw file.
- **Files Affected:** /data/raw reports.csv, /code build_financials.py
- **Validation Performed:** Crossed-checked with actual SEC website.
- **Edits After AI:** N/A
- **Status:** Accepted
- **Notes:** N/A

### Entry 4

- **Date:** 2026-02-23
- **Team Member:** Gracie Vivion
- **Task:** Created a crosswalk for CIK and GVKEY to merge financials_clean.csv and lobbying_clean.csv.
- **AI Prompt (summary):** "Help me create a crosswalk between CIK and GVKEY and merge "financials_clean.csv and lobbying_clean.csv."
- **AI Output (summary):** Created a python code and  crosswalk CSV and merged financials_clean.csv and lobbying_clean.csv.
- **Files Affected:** /data/processed cik_gvkey_crosswalk.csv, /data/final merged_financials_lobbying_balanced.csv, /code create_crosswalk_and_merge.py
- **Validation Performed:** Crossed-checked with actual SEC website.
- **Edits After AI:** Added ROA column to merged_financials_lobbying_balanced.csv
- **Status:** Accepted
- **Notes:** Quite a few blank return cells

### Entry 5

- **Date:** 2026-02-25
- **Team Member:** Shelby Howard (via VS Code Copilot session)
- **Task:** Create and automate a polished data quality report; update reproducibility docs
- **AI Prompt (summary):** "help me create a quality_report.md file..." followed by requests to automate generation and document run steps
- **AI Output (summary):**
  - Generated `results/reports/quality_report.md` with dataset sizes, lobbying missingness, ROA distribution, balanced-panel effect, and exclusion notes
  - Added `code/generate_quality_report.py` to regenerate the report directly from current CSVs
  - Updated `README.md` pipeline steps to include the quality report command and improved formatting
- **Files Affected:**
  - `results/reports/quality_report.md`
  - `code/generate_quality_report.py`
  - `README.md`
  - `AI_Audit.md`
- **Validation Performed:**
  - Ran `python code/generate_quality_report.py` and confirmed report output path
  - Checked generated counts against `data/processed/*.csv` and `data/final/*.csv`
  - Confirmed exclusions logic aligns with `code/fetch_lobbying_data.py`, `code/build_financials.py`, and `code/filter_balanced_panel.py`
- **Edits After AI:**
  - Fixed markdown math escaping issue in generated ROA equation output
  - Standardized README reproducibility formatting for command/output readability
- **Status:** Accepted with changes
- **Notes:** Report values are data-dependent and should be regenerated after any pipeline/data update

### Entry 6

- **Date:** 2026-03-01
- **Team Member:** Project team (via VS Code Copilot session)
- **Task:** Create script to filter merged dataset to balanced panel
- **AI Prompt (summary):** "Help me write a Python script to filter the merged financials and lobbying data to only include firms with observations for all years from 2010-2020"
- **AI Output (summary):** Generated `code/filter_balanced_panel.py` to read the merged CSV, group by firm identifier, check for complete years, and output a balanced panel CSV
- **Files Affected:**
  - `code/filter_balanced_panel.py`
  - `data/final/merged_financials_lobbying_balanced.csv`
- **Validation Performed:**
  - Ran the script and verified the output has firms with 11 years of data
  - Cross-checked counts with original merged dataset
- **Edits After AI:** Minor adjustments to column selection and file paths
- **Status:** Accepted with changes
- **Notes:** Ensures balanced panel for fixed-effects models

### Entry 7

- **Date:** 2026-03-10
- **Team Member:** Gracie Vivion (via VS Code Copilot session)
- **Task:** Download LobbyView data for lobbying reports
- **AI Prompt (summary):** "Assist in creating a script to download LobbyView data including clients.csv and reports.csv"
- **AI Output (summary):** Created `code/download_lobbyview_data.py` with functions to download and save the raw LobbyView datasets
- **Files Affected:**
  - `code/download_lobbyview_data.py`
  - `data/raw/clients.csv`
  - `data/raw/reports.csv`
- **Validation Performed:** Confirmed downloads match expected file sizes and headers from LobbyView documentation
- **Edits After AI:** Updated URLs and added error handling
- **Status:** Accepted with changes
- **Notes:** Follows the guide in `LOBBYVIEW_DOWNLOAD_GUIDE.md`

### Entry 8

- **Date:** 2026-03-15
- **Team Member:** Project team (via VS Code Copilot session)
- **Task:** Explore and clean LobbyView data
- **AI Prompt (summary):** "Help me write a script to explore the LobbyView reports and clients data, clean it, and prepare for merging"
- **AI Output (summary):** Generated `code/explore_lobbyview_data.py` with exploratory data analysis, data cleaning steps, and aggregation to firm-year lobbying spend
- **Files Affected:**
  - `code/explore_lobbyview_data.py`
  - `data/processed/lobbying_clean.csv` (intermediate output)
- **Validation Performed:** Reviewed summary statistics and checked for data integrity
- **Edits After AI:** Adjusted filtering criteria for amendments and no-activity filings
- **Status:** Accepted with changes
- **Notes:** Builds on `fetch_lobbying_data.py` for final cleaning

### Entry 9

- **Date:** 2026-03-20
- **Team Member:** Alycia Reji (via VS Code Copilot session)
- **Task:** Create visualization script for lobbying vs revenue
- **AI Prompt (summary):** "Generate a Python script to visualize the relationship between lobbying expenditures and firm revenue using the merged dataset"
- **AI Output (summary):** Created `code/visualize_lobbying_vs_revenue.py` with matplotlib plots for scatter plots, trends over time, and correlations
- **Files Affected:**
  - `code/visualize_lobbying_vs_revenue.py`
  - `results/figures/` (generated plots)
- **Validation Performed:** Ran the script and verified plots are saved correctly; checked data subsets for accuracy
- **Edits After AI:** Customized plot styles and added labels
- **Status:** Accepted with changes
- **Notes:** Used for exploratory data analysis and presentation

### Entry 10

- **Date:** 2026-04-01
- **Team Member:** Daniz Mammadova (via VS Code Copilot session)
- **Task:** Perform exploratory data analysis in Jupyter notebook
- **AI Prompt (summary):** "Help me set up a Jupyter notebook for EDA on the lobbying and financial data, including statistical summaries and visualizations"
- **AI Output (summary):** Assisted in structuring `capstone_eda.ipynb` with cells for data loading, descriptive stats, correlations, and initial regression models
- **Files Affected:**
  - `capstone_eda.ipynb`
- **Validation Performed:** Executed notebook cells and reviewed outputs for correctness
- **Edits After AI:** Added custom analysis cells and refined interpretations
- **Status:** Accepted with changes
- **Notes:** Complements the Python scripts with interactive analysis

### Entry 12
- **Date:** 2026-04-13
- **Team Member:** Shelby Howard
- **AI Prompt (summary):** "Build Milestone 3 econometric script with two-way fixed effects, ARIMA benchmark, diagnostics, and robustness checks."
- **AI Output (summary):**
  - Generated/updated functions for FE estimation with firm and year effects
  - Added clustered standard error option, VIF, Breusch-Pagan, residual plots
  - Added lag robustness, placebo lead, outlier-year exclusion, subgroup checks
- **Files Affected:**
  - `code/capstone_models.py`
  - `results/tables/M3_*.csv|txt|tex`
  - `results/reports/M3_interpretation.md`
- **Verification Performed:**
  - Ran `python code/capstone_models.py`
  - Checked expected output files exist and contain values
  - Confirmed clustered-SE table differs from standard-SE table
- **Critique/Corrections by Team:**
  - Revised interpretation wording to avoid causal overstatement
  - Kept non-significant findings explicit rather than forcing strong claims
- **Status:** Accepted with changes

### Entry 12: Bonus Implementation (Three-Way FE + Modern DiD + Bootstrap)
- **Date:** 2026-04-14
- **Team Member:** Shelby Howard
- **AI Prompt (summary):** "Implement bonus-point methods in the existing M3 pipeline and regenerate outputs."
- **AI Output (summary):**
  - Added three-way FE specification with firm FE, year FE, and proxy-sector-by-year interactions
  - Added modern staggered-adoption DiD routine (Callaway-Sant'Anna style ATT(g,t) using not-yet-treated controls)
  - Added firm-cluster bootstrap interval for lobbying coefficient
  - Exported bonus tables and integrated bonus discussion into interpretation memo
- **Files Affected:**
  - `code/capstone_models.py`
  - `results/tables/M3_bonus_three_way_fe_coefficients.csv`
  - `results/tables/M3_bonus_did_attgt.csv`
  - `results/tables/M3_bonus_did_event_study.csv`
  - `results/tables/M3_bonus_did_size_heterogeneity.csv`
  - `results/tables/M3_bonus_did_summary.txt`
  - `results/tables/M3_bonus_bootstrap_clustered.csv`
  - `results/reports/M3_interpretation.md`
- **Verification Performed:**
  - Ran `python code/capstone_models.py` successfully end-to-end
  - Confirmed new bonus output files were created and non-empty
  - Validated script has no static errors from VS Code problems check
- **Critique/Corrections by Team:**
  - AI initially used a computationally heavy bootstrap design; team revised to a faster cluster-resampling implementation so pipeline completes reliably
  - AI initially produced a combined DiD output table; team split event-study and heterogeneity tables for grading clarity
- **Status:** Accepted with changes
- **Verification Evidence Summary**
- Execution command used:
  - `/home/codespace/.python/current/bin/python code/capstone_models.py`
- Successful run prints:
  - `M3 econometric models completed successfully.`
- Core diagnostics generated:
  - Breusch-Pagan table, VIF table, residual figures
- Robustness generated:
  - Standard vs clustered SE, lag alternatives, placebo, outlier exclusion, subgroup checks
- Bonus generated:
  - Three-way FE table, modern DiD ATT(g,t) tables, cluster bootstrap table

### Entry 13: Milestone 3 Polishing and Final Verification
- **Date:** 2026-04-25
- **Team Member:** Project team (via VS Code Copilot session)
- **Task:** Polish Milestone 3 presentation deliverables and tighten interpretation language
- **AI Prompt:** "Fix final M3 issues: cleaner academic regression table, cautious interpretation framing, and explicit M3 audit documentation"
- **AI Output:**
  - Refactored regression-table export into academic style with one column per model, variable rows, and parenthesized standard errors on separate lines
  - Added summary rows for fixed effects, clustered SE status, observations, and adjusted R-squared
  - Tightened memo language to avoid causal overstatement and explicitly note reverse-causality risk from the lead/placebo check
  - Added this explicit M3 final-polish audit record
- **Files Affected:**
  - `code/capstone_models.py`
  - `results/tables/M3_regression_table.csv`
  - `results/tables/M3_regression_table_academic.csv`
  - `results/tables/M3_regression_table_academic.xlsx` (if engine available)
  - `results/reports/M3_interpretation.md`
  - `AI_AUDIT_APPENDIX.md`
- **Validation Performed:**
  - Re-ran `python code/capstone_models.py` end-to-end
  - Confirmed refreshed tables were written to `results/tables/`
  - Checked memo text reflects association-first framing and explicitly avoids definitive causal claims
  - Verified no new errors in modified files via VS Code problems check
- **Edits After AI:** Team-reviewed wording and retained conservative interpretation language
- **Status:** Accepted with changes
- **Notes:** This entry documents the final pre-submission presentation and documentation pass for Milestone 3.


**AI Use Disclosure**
AI tools were used to assist with debugging, code structuring, and documentation drafting. All outputs were reviewed, tested, and validated manually. The research design, data decisions, and interpretation of results were completed independently by the project team.

All of the following were completed and verified by the project team:
    - Selection of research question
    - Data acquisition decisions (SEC Q4 data, lobbying data)
    - Design of empirical strategy
    - Construction of crosswalk logic
    - Validation of merge results
    - Interpretation of regression output
    - Final decisions on modeling specifications
All code was reviewed, edited, and tested manually before inclusion in the final repository.