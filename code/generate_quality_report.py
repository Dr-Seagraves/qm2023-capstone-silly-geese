"""
Generate results/reports/quality_report.md from current project datasets.

This script computes:
- Dataset sizes before and after merge
- Percentage missing lobbying
- ROA distribution summary
- Balanced panel filtering effect
- Data exclusions applied in the cleaning pipeline
"""

from __future__ import annotations

from datetime import date

import pandas as pd

from config_paths import FINAL_DATA_DIR, PROCESSED_DATA_DIR, RAW_DATA_DIR, REPORTS_DIR


def load_inputs() -> dict[str, pd.DataFrame]:
    """Load all input datasets needed for quality metrics."""
    financials = pd.read_csv(PROCESSED_DATA_DIR / "financials_clean.csv")
    lobbying = pd.read_csv(PROCESSED_DATA_DIR / "lobbying_clean.csv")
    crosswalk = pd.read_csv(PROCESSED_DATA_DIR / "cik_gvkey_crosswalk.csv")

    merged = pd.read_csv(FINAL_DATA_DIR / "merged_financials_lobbying.csv")
    balanced = pd.read_csv(FINAL_DATA_DIR / "merged_financials_lobbying_balanced.csv")

    reports = pd.read_csv(RAW_DATA_DIR / "reports.csv", low_memory=False)
    clients = pd.read_csv(RAW_DATA_DIR / "clients.csv")

    return {
        "financials": financials,
        "lobbying": lobbying,
        "crosswalk": crosswalk,
        "merged": merged,
        "balanced": balanced,
        "reports": reports,
        "clients": clients,
    }


def compute_metrics(data: dict[str, pd.DataFrame]) -> dict:
    """Compute all quality report metrics."""
    financials = data["financials"]
    lobbying = data["lobbying"]
    crosswalk = data["crosswalk"]
    merged = data["merged"]
    balanced = data["balanced"]
    reports = data["reports"]
    clients = data["clients"]

    missing_lobby_count = int(merged["lobbying_spend"].isna().sum())
    missing_lobby_rate = float(merged["lobbying_spend"].isna().mean())

    roa = merged["roa"]

    reports_work = reports.copy()
    reports_work["is_no_activity"] = reports_work["is_no_activity"].astype(str)
    reports_work["is_amendment"] = reports_work["is_amendment"].astype(str)
    reports_filtered = reports_work[
        (reports_work["is_no_activity"] == "False")
        & (reports_work["is_amendment"] == "False")
    ]

    lobbying_firm_year = (
        reports_filtered.groupby(["lob_id", "filing_year"])["amount"].sum().reset_index()
    )
    lobbying_with_gvkey = lobbying_firm_year.merge(
        clients[["lob_id", "gvkey"]], on="lob_id", how="left"
    )
    lobbying_after_gvkey = lobbying_with_gvkey.dropna(subset=["gvkey"])

    assets_gt_1m_keep = int((merged["Assets"] > 1_000_000).sum())
    assets_gt_1m_exclude = int(len(merged) - assets_gt_1m_keep)

    return {
        "date": date.today().isoformat(),
        "year_min": int(merged["year"].min()),
        "year_max": int(merged["year"].max()),
        "financials_rows": int(len(financials)),
        "financials_firms": int(financials["cik"].nunique()),
        "lobbying_rows": int(len(lobbying)),
        "lobbying_firms": int(lobbying["gvkey"].nunique()),
        "crosswalk_rows": int(len(crosswalk)),
        "crosswalk_cik": int(crosswalk["cik"].nunique()),
        "crosswalk_gvkey": int(crosswalk["gvkey"].nunique()),
        "merged_rows": int(len(merged)),
        "merged_firms": int(merged["cik"].nunique()),
        "balanced_rows": int(len(balanced)),
        "balanced_firms": int(balanced["cik"].nunique()),
        "merged_with_gvkey": int(merged["gvkey"].notna().sum()),
        "merged_without_gvkey": int(merged["gvkey"].isna().sum()),
        "rows_with_lobbying": int(merged["lobbying_spend"].notna().sum()),
        "missing_lobby_count": missing_lobby_count,
        "missing_lobby_rate": missing_lobby_rate,
        "roa_count": int(roa.notna().sum()),
        "roa_missing": int(roa.isna().sum()),
        "roa_mean": float(roa.mean()),
        "roa_std": float(roa.std()),
        "roa_min": float(roa.min()),
        "roa_p25": float(roa.quantile(0.25)),
        "roa_median": float(roa.median()),
        "roa_p75": float(roa.quantile(0.75)),
        "roa_max": float(roa.max()),
        "balanced_rows_removed": int(len(merged) - len(balanced)),
        "balanced_rows_removed_rate": float((len(merged) - len(balanced)) / len(merged)),
        "balanced_firms_removed": int(merged["cik"].nunique() - balanced["cik"].nunique()),
        "balanced_firms_removed_rate": float(
            (merged["cik"].nunique() - balanced["cik"].nunique())
            / merged["cik"].nunique()
        ),
        "reports_raw": int(len(reports)),
        "reports_after_activity_filter": int(len(reports_filtered)),
        "reports_removed_activity_filter": int(len(reports) - len(reports_filtered)),
        "lobby_firm_year_before_gvkey_drop": int(len(lobbying_with_gvkey)),
        "lobby_firm_year_after_gvkey_drop": int(len(lobbying_after_gvkey)),
        "lobby_firm_year_removed_missing_gvkey": int(
            len(lobbying_with_gvkey) - len(lobbying_after_gvkey)
        ),
        "assets_gt_1m_keep": assets_gt_1m_keep,
        "assets_gt_1m_exclude": assets_gt_1m_exclude,
    }


def render_report(metrics: dict) -> str:
    """Render markdown quality report text."""
    return f"""# Data Quality Report

**Project:** QM 2023 Capstone (Lobbying and Profitability)  
**Report date:** {metrics['date']}  
**Data window used for merged panel:** {metrics['year_min']}–{metrics['year_max']}

## 1) Dataset Sizes Before and After Merge

### Core input datasets

| Dataset | Rows | Unique firms | Firm ID |
|---|---:|---:|---|
| `financials_clean.csv` | {metrics['financials_rows']:,} | {metrics['financials_firms']:,} | `cik` |
| `lobbying_clean.csv` | {metrics['lobbying_rows']:,} | {metrics['lobbying_firms']:,} | `gvkey` |
| `cik_gvkey_crosswalk.csv` | {metrics['crosswalk_rows']:,} | {metrics['crosswalk_cik']:,} (`cik`) / {metrics['crosswalk_gvkey']:,} (`gvkey`) | both |

### Merge output

| Output dataset | Rows | Unique firms (`cik`) |
|---|---:|---:|
| `merged_financials_lobbying.csv` | {metrics['merged_rows']:,} | {metrics['merged_firms']:,} |
| `merged_financials_lobbying_balanced.csv` | {metrics['balanced_rows']:,} | {metrics['balanced_firms']:,} |

Additional merge coverage diagnostics:
- Rows with matched `gvkey` in merged panel: **{metrics['merged_with_gvkey']:,}**
- Rows without matched `gvkey`: **{metrics['merged_without_gvkey']:,}**
- Rows with non-missing `lobbying_spend`: **{metrics['rows_with_lobbying']:,}**

## 2) Percentage Missing Lobbying

In `merged_financials_lobbying.csv`:

- Missing `lobbying_spend`: **{metrics['missing_lobby_count']:,} / {metrics['merged_rows']:,} rows**
- Missingness rate: **{metrics['missing_lobby_rate'] * 100:.2f}%**
- Non-missing rate: **{(1 - metrics['missing_lobby_rate']) * 100:.2f}%**

Interpretation: lobbying coverage is sparse relative to the full financial panel, mainly because many financial firms do not map to a `gvkey` in the crosswalk and because lobbying is only observed for a subset of firm-years.

## 3) ROA Distribution Summary

ROA is defined as:

\\[
\text{{ROA}} = \frac{{\text{{NetIncomeLoss}}}}{{\text{{Assets}}}}
\\]

Summary in `merged_financials_lobbying.csv`:

| Statistic | Value |
|---|---:|
| Non-missing count | {metrics['roa_count']:,} |
| Missing count | {metrics['roa_missing']:,} |
| Mean | {metrics['roa_mean']:,.4f} |
| Std. Dev. | {metrics['roa_std']:,.4f} |
| Min | {metrics['roa_min']:,.4f} |
| 25th percentile | {metrics['roa_p25']:,.4f} |
| Median | {metrics['roa_median']:,.4f} |
| 75th percentile | {metrics['roa_p75']:,.4f} |
| Max | {metrics['roa_max']:,.4f} |

Interpretation: the distribution is highly skewed with extreme outliers; median and quartiles are much more stable than the mean for describing typical firm-year profitability in this panel.

## 4) Balanced Panel Filtering Effect

Balanced panel rule from `filter_balanced_panel.py`: keep firms observed in **all years 2010–2020**.

Effect of this filter:

- Rows before filter: **{metrics['merged_rows']:,}**
- Rows after filter: **{metrics['balanced_rows']:,}**
- Rows removed: **{metrics['balanced_rows_removed']:,} ({metrics['balanced_rows_removed_rate'] * 100:.2f}%)**
- Firms before filter: **{metrics['merged_firms']:,}**
- Firms after filter: **{metrics['balanced_firms']:,}**
- Firms removed: **{metrics['balanced_firms_removed']:,} ({metrics['balanced_firms_removed_rate'] * 100:.2f}%)**

This indicates strong attrition under a strict balanced-panel requirement. The balanced sample improves longitudinal consistency but greatly reduces breadth.

## 5) Data Exclusions Applied

### Exclusions explicitly applied in pipeline

1. **Lobbying reports cleanup (`fetch_lobbying_data.py`)**
   - Raw reports: **{metrics['reports_raw']:,}**
   - Removed no-activity/amendment filings: **{metrics['reports_removed_activity_filter']:,}**
   - Remaining reports: **{metrics['reports_after_activity_filter']:,}**

2. **Lobbying firm-year construction**
   - Firm-year rows before dropping missing `gvkey`: **{metrics['lobby_firm_year_before_gvkey_drop']:,}**
   - Dropped due to missing `gvkey`: **{metrics['lobby_firm_year_removed_missing_gvkey']:,}**
   - Final lobbying clean rows: **{metrics['lobby_firm_year_after_gvkey_drop']:,}**

3. **Financials construction (`build_financials.py`)**
   - Keeps only **10-K** forms
   - Keeps only **USD** observations
   - Keeps core tags: `Assets`, `NetIncomeLoss`, and revenue tags normalized to `Revenues`

4. **Balanced panel restriction (`filter_balanced_panel.py`)**
   - Keeps only firms with complete 2010–2020 coverage

### Example exclusion check: `Assets > 1,000,000`

This is **not currently enforced** in the provided scripts, but if applied to `merged_financials_lobbying.csv` it would:

- Keep: **{metrics['assets_gt_1m_keep']:,}** rows
- Exclude: **{metrics['assets_gt_1m_exclude']:,}** rows (`Assets <= 1,000,000`)

---

## Practical Note

For modeling, consider reporting both:
- full-sample results (with clear missingness handling), and
- balanced-panel robustness checks, to show stability of findings under different sample restrictions.
"""


def main() -> None:
    data = load_inputs()
    metrics = compute_metrics(data)
    report_text = render_report(metrics)

    output_path = REPORTS_DIR / "quality_report.md"
    output_path.write_text(report_text, encoding="utf-8")

    print(f"Saved quality report to: {output_path}")


if __name__ == "__main__":
    main()
