# AI Audit Appendix

This file documents how AI tools were used during the project, what was generated, and how outputs were verified by humans.

## Purpose

- Improve transparency and reproducibility of AI-assisted work.
- Record where AI influenced code, documentation, analysis, or interpretation.
- Track human review steps before accepting AI-generated content.

## AI Tools Used

| Tool | Version / Model | Primary Use in This Project |
|---|---|---|
| GitHub Copilot (VS Code) | GPT-5.3-Codex | Drafting documentation, code assistance, and workflow support |

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

- **Date:** 2026-03-28
- **Team Member:** Shelby Howard
- **Task:** Expand and continue AI audit appendix documentation
- **AI Prompt (summary):** "create new entries in the ai audit appendix"
- **AI Output (summary):** Added new structured audit entries to continue project AI-use tracking
- **Files Affected:**
  - `AI_Audit_Appendix.md`
- **Validation Performed:**
  - Confirmed new entries follow the existing appendix template fields
  - Checked placement under the Audit Entries section
- **Edits After AI:** None
- **Status:** Accepted
- **Notes:** Use Entries 7 and 8 below as structured placeholders for upcoming AI-assisted tasks

### Entry 7

- **Date:** 2026-03-28
- **Team Member:** Shelby Howard (via VS Code Copilot session)
- **Task:** Build and document EDA notebook visuals for lobbying and firm-performance analysis
- **AI Prompt (summary):** "help generate and structure the capstone EDA notebook with required plots and interpretations"
- **AI Output (summary):** Produced notebook code and interpretation text for 10 EDA plots (correlation heatmap, time trends, lag checks, rolling correlation, controls diagnostics, decomposition, nonlinear checks, within-firm changes, and yearly controlled effects), and saved figure outputs to the results folder
- **Files Affected:**
  - `capstone_eda.ipynb`
  - `results/figures/plot1_correlation_heatmap.png`
  - `results/figures/plot2_outcome_time_series.png`
  - `results/figures/plot3_dual_axis_outcome_driver.png`
  - `results/figures/plot4_lagged_effect_analysis.png`
  - `results/figures/plot5_rolling_correlation.png`
  - `results/figures/plot6_control_scatter_regression.png`
  - `results/figures/plot7_time_series_decomposition.png`
  - `results/figures/plot8_outcome_by_driver_quintile.png`
  - `results/figures/plot9_within_firm_changes.png`
  - `results/figures/plot10_yearly_controlled_lobbying_effect.png`
- **Validation Performed:**
  - Confirmed notebook reads from `data/final/merged_financials_lobbying.csv` and applies documented filters
  - Verified each plot cell includes save logic to `results/figures/` with explicit filenames
  - Checked interpretation text aligns with displayed diagnostics/correlation outputs in the notebook
  - Reviewed model-oriented notes for consistency with planned M3 robustness checks
- **Edits After AI:**
  - Minor manual revisions to interpretation wording for clarity and consistency in M3 references
- **Status:** Accepted with changes
- **Notes:** Re-run notebook and regenerate figures if source data or variable construction changes



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