# Data Quality Report

**Project:** QM 2023 Capstone (Lobbying and Profitability)  
**Report date:** 2026-02-26  
**Data window used for merged panel:** 2010–2020

## 1) Dataset Sizes Before and After Merge

### Core input datasets

| Dataset | Rows | Unique firms | Firm ID |
|---|---:|---:|---|
| `financials_clean.csv` | 4,932 | 1,375 | `cik` |
| `lobbying_clean.csv` | 11,619 | 1,534 | `gvkey` |
| `cik_gvkey_crosswalk.csv` | 215 | 199 (`cik`) / 159 (`gvkey`) | both |

### Merge output

| Output dataset | Rows | Unique firms (`cik`) |
|---|---:|---:|
| `merged_financials_lobbying.csv` | 5,099 | 1,375 |
| `merged_financials_lobbying_balanced.csv` | 836 | 66 |

Additional merge coverage diagnostics:
- Rows with matched `gvkey` in merged panel: **1,428**
- Rows without matched `gvkey`: **3,671**
- Rows with non-missing `lobbying_spend`: **245**

## 2) Percentage Missing Lobbying

In `merged_financials_lobbying.csv`:

- Missing `lobbying_spend`: **4,854 / 5,099 rows**
- Missingness rate: **95.20%**
- Non-missing rate: **4.80%**

Interpretation: lobbying coverage is sparse relative to the full financial panel, mainly because many financial firms do not map to a `gvkey` in the crosswalk and because lobbying is only observed for a subset of firm-years.

## 3) ROA Distribution Summary

ROA is defined as:

\[
	ext{ROA} = rac{	ext{NetIncomeLoss}}{	ext{Assets}}
\]

Summary in `merged_financials_lobbying.csv`:

| Statistic | Value |
|---|---:|
| Non-missing count | 4,252 |
| Missing count | 847 |
| Mean | 56.9434 |
| Std. Dev. | 4,277.7843 |
| Min | -43,642.7278 |
| 25th percentile | -0.4223 |
| Median | 0.0000 |
| 75th percentile | 0.0548 |
| Max | 222,261.0000 |

Interpretation: the distribution is highly skewed with extreme outliers; median and quartiles are much more stable than the mean for describing typical firm-year profitability in this panel.

## 4) Balanced Panel Filtering Effect

Balanced panel rule from `filter_balanced_panel.py`: keep firms observed in **all years 2010–2020**.

Effect of this filter:

- Rows before filter: **5,099**
- Rows after filter: **836**
- Rows removed: **4,263 (83.60%)**
- Firms before filter: **1,375**
- Firms after filter: **66**
- Firms removed: **1,309 (95.20%)**

This indicates strong attrition under a strict balanced-panel requirement. The balanced sample improves longitudinal consistency but greatly reduces breadth.

## 5) Data Exclusions Applied

### Exclusions explicitly applied in pipeline

1. **Lobbying reports cleanup (`fetch_lobbying_data.py`)**
   - Raw reports: **349,090**
   - Removed no-activity/amendment filings: **63,126**
   - Remaining reports: **285,964**

2. **Lobbying firm-year construction**
   - Firm-year rows before dropping missing `gvkey`: **83,581**
   - Dropped due to missing `gvkey`: **71,962**
   - Final lobbying clean rows: **11,619**

3. **Financials construction (`build_financials.py`)**
   - Keeps only **10-K** forms
   - Keeps only **USD** observations
   - Keeps core tags: `Assets`, `NetIncomeLoss`, and revenue tags normalized to `Revenues`

4. **Balanced panel restriction (`filter_balanced_panel.py`)**
   - Keeps only firms with complete 2010–2020 coverage

### Example exclusion check: `Assets > 1,000,000`

This is **not currently enforced** in the provided scripts, but if applied to `merged_financials_lobbying.csv` it would:

- Keep: **3,695** rows
- Exclude: **1,404** rows (`Assets <= 1,000,000`)

---

## Practical Note

For modeling, consider reporting both:
- full-sample results (with clear missingness handling), and
- balanced-panel robustness checks, to show stability of findings under different sample restrictions.
