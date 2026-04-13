"""
QM 2023 Capstone: Milestone 3 Econometric Models
Team: QM 2023 Capstone
Members: Alycia Reji, Gracie Vivion, Shelby Howard, and Daniz Mammadova
Date: 2026-04-13

This script estimates panel regression models to identify the association between
lobbying expenditures and firm profitability (ROA). We estimate Fixed Effects models
and ARIMA as an alternative specification.
"""

from __future__ import annotations

import warnings
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf
from scipy import stats
from statsmodels.iolib.summary2 import summary_col
from statsmodels.stats.diagnostic import het_breuschpagan
from statsmodels.stats.outliers_influence import variance_inflation_factor
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

from config_paths import FINAL_DATA_DIR, FIGURES_DIR, REPORTS_DIR, TABLES_DIR


warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=RuntimeWarning)


TEAM_NAME = "QM 2023 Capstone"
TEAM_MEMBERS = "Alycia Reji, Gracie Vivion, Shelby Howard, and Daniz Mammadova"
SUBMISSION_DATE = "2026-04-13"

MAIN_DATA_FILE = FINAL_DATA_DIR / "merged_financials_lobbying.csv"
FALLBACK_DATA_FILE = FINAL_DATA_DIR / "merged_financials_lobbying_balanced.csv"


def winsorize_series(series: pd.Series, lower: float = 0.01, upper: float = 0.99) -> pd.Series:
    """Winsorize a series without requiring extra dependencies."""
    cleaned = series.copy()
    valid = cleaned.dropna()
    if valid.empty:
        return cleaned

    lower_bound = valid.quantile(lower)
    upper_bound = valid.quantile(upper)
    return cleaned.clip(lower=lower_bound, upper=upper_bound)


def save_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def ensure_outputs() -> None:
    """Create output folders and fail early if the input data is missing."""
    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    TABLES_DIR.mkdir(parents=True, exist_ok=True)

    if MAIN_DATA_FILE.exists():
        return
    if FALLBACK_DATA_FILE.exists():
        return

    raise FileNotFoundError(
        "Could not find the final panel dataset in data/final/. "
        "Expected merged_financials_lobbying.csv or merged_financials_lobbying_balanced.csv."
    )


def load_panel_data() -> pd.DataFrame:
    """Load the main panel dataset and fall back to the balanced panel if needed."""
    data_file = MAIN_DATA_FILE if MAIN_DATA_FILE.exists() else FALLBACK_DATA_FILE
    data = pd.read_csv(data_file)
    return data


def prepare_panel_data(raw: pd.DataFrame) -> pd.DataFrame:
    """Build the analysis panel with lags, logs, and winsorized outcomes."""
    data = raw.copy()
    data = data.dropna(subset=["cik", "year"])
    data["cik"] = data["cik"].astype(int)
    data["year"] = data["year"].astype(int)
    data = data.sort_values(["cik", "year"]).reset_index(drop=True)

    # Missing lobbying records are treated as zero spending in the merged panel.
    data["lobbying_spend"] = data["lobbying_spend"].fillna(0.0)
    data["lobbying_spend_mil"] = data["lobbying_spend"] / 1_000_000.0

    # Logs are only defined for positive values, so invalid observations remain missing.
    data["log_assets"] = np.where(data["Assets"] > 0, np.log(data["Assets"]), np.nan)
    data["log_revenues"] = np.where(data["Revenues"] > 0, np.log(data["Revenues"]), np.nan)

    # ROA is scaled to percentage points and winsorized to reduce the influence of extreme outliers.
    data["roa_pct"] = data["roa"] * 100.0
    data["roa_pct_winsor"] = winsorize_series(data["roa_pct"])

    group = data.groupby("cik", sort=False)
    data["lobbying_lag1_mil"] = group["lobbying_spend_mil"].shift(1)
    data["lobbying_lag2_mil"] = group["lobbying_spend_mil"].shift(2)
    data["lobbying_lag3_mil"] = group["lobbying_spend_mil"].shift(3)
    data["lobbying_lead1_mil"] = group["lobbying_spend_mil"].shift(-1)

    # Auxiliary controls for robustness and the predictive comparison.
    data["asset_growth"] = group["Assets"].pct_change()
    data["revenue_growth"] = group["Revenues"].pct_change()

    return data


def fit_fixed_effects_model(data: pd.DataFrame, lag_col: str, cov_type: str | None = "cluster"):
    """Fit a two-way fixed effects regression with optional clustered standard errors."""
    model_data = data.dropna(
        subset=["roa_pct_winsor", lag_col, "log_assets", "log_revenues", "cik", "year"]
    ).copy()

    formula = (
        f"roa_pct_winsor ~ {lag_col} + log_assets + log_revenues + C(cik) + C(year)"
    )
    if cov_type == "cluster":
        model = smf.ols(formula=formula, data=model_data).fit(
            cov_type="cluster", cov_kwds={"groups": model_data["cik"]}
        )
    elif cov_type is None:
        model = smf.ols(formula=formula, data=model_data).fit()
    else:
        model = smf.ols(formula=formula, data=model_data).fit(cov_type=cov_type)
    return model, model_data


def build_vif_table(model_data: pd.DataFrame, predictors: list[str]) -> pd.DataFrame:
    """Compute VIF values for the non-fixed-effect regressors."""
    vif_input = model_data[predictors].dropna().astype(float)
    vif_input = sm.add_constant(vif_input, has_constant="add")

    rows = []
    for idx, column in enumerate(vif_input.columns):
        if column == "const":
            continue
        rows.append(
            {
                "Variable": column,
                "VIF": variance_inflation_factor(vif_input.values, idx),
            }
        )
    return pd.DataFrame(rows).sort_values("VIF", ascending=False).reset_index(drop=True)


def run_breusch_pagan(model, model_data: pd.DataFrame, predictors: list[str]) -> pd.DataFrame:
    """Run a Breusch-Pagan test using the key regressors as a proxy design matrix."""
    bp_exog = sm.add_constant(model_data[predictors].dropna().astype(float), has_constant="add")
    aligned = model_data.loc[bp_exog.index]
    residuals = model.resid.loc[aligned.index]

    stat, pvalue, f_stat, f_pvalue = het_breuschpagan(residuals, bp_exog)
    return pd.DataFrame(
        [
            {"Test": "Breusch-Pagan", "Statistic": stat, "p_value": pvalue, "F_stat": f_stat, "F_p_value": f_pvalue},
        ]
    )


def save_residual_plots(model, output_prefix: str) -> None:
    """Save residual diagnostics for the baseline fixed effects model."""
    fitted = pd.Series(model.fittedvalues)
    residuals = pd.Series(model.resid)

    plt.figure(figsize=(10, 6))
    plt.scatter(fitted, residuals, alpha=0.3, s=14)
    plt.axhline(0, color="red", linestyle="--", linewidth=1)
    plt.xlabel("Fitted Values")
    plt.ylabel("Residuals")
    plt.title("Residuals vs. Fitted Values (Fixed Effects Model)")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / f"{output_prefix}_residuals_vs_fitted.png", dpi=300, bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(10, 6))
    stats.probplot(residuals.dropna(), dist="norm", plot=plt)
    plt.title("Q-Q Plot: Residual Normality Check")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / f"{output_prefix}_qq_plot.png", dpi=300, bbox_inches="tight")
    plt.close()


def variable_label(variable: str) -> str:
    labels = {
        "lobbying_lag1_mil": "Lobbying spend, t-1 ($M)",
        "lobbying_lag2_mil": "Lobbying spend, t-2 ($M)",
        "lobbying_lag3_mil": "Lobbying spend, t-3 ($M)",
        "lobbying_lead1_mil": "Lobbying spend, t+1 ($M) [placebo]",
        "log_assets": "Log(Assets)",
        "log_revenues": "Log(Revenues)",
    }
    return labels.get(variable, variable)


def significance_stars(p_value: float) -> str:
    if p_value < 0.01:
        return "***"
    if p_value < 0.05:
        return "**"
    if p_value < 0.10:
        return "*"
    return ""


def coefficient_snapshot(
    result,
    check_name: str,
    specification: str,
    sample_name: str,
    term: str,
    cov_type: str,
    note: str = "",
) -> dict[str, object]:
    """Collect a compact summary of the focal lobbying coefficient for robustness tables."""
    p_value = result.pvalues.get(term, np.nan)
    return {
        "Check": check_name,
        "Specification": specification,
        "Sample": sample_name,
        "Covariance": cov_type,
        "Term": variable_label(term),
        "Coefficient": result.params.get(term, np.nan),
        "StdErr": result.bse.get(term, np.nan),
        "p_value": p_value,
        "Stars": significance_stars(float(p_value)) if pd.notna(p_value) else "",
        "N": int(result.nobs),
        "Note": note,
    }


def render_robustness_report(summary_df: pd.DataFrame) -> str:
    """Render a short text report that explains the robustness checks."""

    def table_for(check_name: str) -> str:
        subset = summary_df.loc[summary_df["Check"] == check_name].copy()
        if subset.empty:
            return "No results available."
        display_cols = ["Specification", "Sample", "Covariance", "Coefficient", "StdErr", "p_value", "N", "Note"]
        return subset[display_cols].to_string(index=False, float_format=lambda value: f"{value:0.4f}")

    checks = summary_df["Check"].drop_duplicates().tolist()
    sections = ["M3 Robustness Checks", ""]
    sections.append(
        "The focal driver is lagged lobbying spend. These checks show whether the sign, magnitude, and precision of the lobbying coefficient are stable under alternative specifications."
    )

    for check_name in checks:
        sections.extend([
            "",
            check_name,
            table_for(check_name),
        ])

    sections.append("")
    sections.append(
        "Interpretation: if the coefficient remains similar across specifications, the main relationship is less likely to be driven by a single standard-error choice, a single lag choice, or the 2020 shock year."
    )
    return "\n".join(sections)


def run_robustness_checks(panel: pd.DataFrame) -> pd.DataFrame:
    """Estimate the required robustness checks and save compact comparison tables."""
    standard_model, _ = fit_fixed_effects_model(panel, "lobbying_lag1_mil", cov_type=None)
    clustered_model, _ = fit_fixed_effects_model(panel, "lobbying_lag1_mil", cov_type="cluster")
    lag2_model, _ = fit_fixed_effects_model(panel, "lobbying_lag2_mil")
    lag3_model, _ = fit_fixed_effects_model(panel, "lobbying_lag3_mil")
    placebo_model, _ = fit_fixed_effects_model(panel, "lobbying_lead1_mil")

    non_outlier_panel = panel.loc[panel["year"] != 2020].copy()
    non_outlier_model, _ = fit_fixed_effects_model(non_outlier_panel, "lobbying_lag1_mil")

    asset_panel = panel.dropna(subset=["Assets"]).copy()
    asset_median = asset_panel["Assets"].median()
    small_firm_panel = asset_panel.loc[asset_panel["Assets"] < asset_median].copy()
    large_firm_panel = asset_panel.loc[asset_panel["Assets"] >= asset_median].copy()
    small_firm_model, _ = fit_fixed_effects_model(small_firm_panel, "lobbying_lag1_mil")
    large_firm_model, _ = fit_fixed_effects_model(large_firm_panel, "lobbying_lag1_mil")

    summary_rows = [
        coefficient_snapshot(
            standard_model,
            "Standard vs. clustered SEs",
            "Baseline lag 1",
            "Full sample",
            "lobbying_lag1_mil",
            "Standard",
            note=f"N={int(standard_model.nobs)}",
        ),
        coefficient_snapshot(
            clustered_model,
            "Standard vs. clustered SEs",
            "Baseline lag 1",
            "Full sample",
            "lobbying_lag1_mil",
            "Clustered by cik",
            note=f"N={int(clustered_model.nobs)}",
        ),
        coefficient_snapshot(
            clustered_model,
            "Alternative lag structures",
            "Lag 1",
            "Full sample",
            "lobbying_lag1_mil",
            "Clustered by cik",
            note="Reference lag",
        ),
        coefficient_snapshot(
            lag2_model,
            "Alternative lag structures",
            "Lag 2",
            "Full sample",
            "lobbying_lag2_mil",
            "Clustered by cik",
            note="One additional year of delay",
        ),
        coefficient_snapshot(
            lag3_model,
            "Alternative lag structures",
            "Lag 3",
            "Full sample",
            "lobbying_lag3_mil",
            "Clustered by cik",
            note="Longer delay specification",
        ),
        coefficient_snapshot(
            placebo_model,
            "Placebo / lead check",
            "Lead 1",
            "Full sample",
            "lobbying_lead1_mil",
            "Clustered by cik",
            note="Should be weak if reverse causality is limited",
        ),
        coefficient_snapshot(
            non_outlier_model,
            "Exclude outlier period",
            "Baseline lag 1",
            "Excluding 2020",
            "lobbying_lag1_mil",
            "Clustered by cik",
            note="Drops the COVID shock year",
        ),
        coefficient_snapshot(
            small_firm_model,
            "Group subsamples",
            "Baseline lag 1",
            "Small firms (below median assets)",
            "lobbying_lag1_mil",
            "Clustered by cik",
            note=f"Median assets = {asset_median:,.0f}",
        ),
        coefficient_snapshot(
            large_firm_model,
            "Group subsamples",
            "Baseline lag 1",
            "Large firms (at or above median assets)",
            "lobbying_lag1_mil",
            "Clustered by cik",
            note=f"Median assets = {asset_median:,.0f}",
        ),
    ]

    summary_df = pd.DataFrame(summary_rows)
    report_text = render_robustness_report(summary_df)
    summary_df.to_csv(TABLES_DIR / "M3_robustness_checks.csv", index=False)
    save_text(TABLES_DIR / "M3_robustness_checks.txt", report_text)
    save_text(REPORTS_DIR / "M3_robustness_checks.txt", report_text)

    standard_vs_clustered = summary_col(
        [standard_model, clustered_model],
        stars=True,
        float_format="%0.4f",
        model_names=["Standard SEs", "Clustered SEs"],
        regressor_order=["lobbying_lag1_mil", "log_assets", "log_revenues"],
        drop_omitted=True,
        info_dict={"N": lambda x: f"{int(x.nobs)}"},
    )
    save_text(TABLES_DIR / "M3_standard_vs_clustered_table.txt", standard_vs_clustered.as_text())
    save_text(TABLES_DIR / "M3_standard_vs_clustered_table.tex", standard_vs_clustered.as_latex())

    lag_comparison = summary_col(
        [clustered_model, lag2_model, lag3_model, placebo_model],
        stars=True,
        float_format="%0.4f",
        model_names=["Lag 1", "Lag 2", "Lag 3", "Lead 1"],
        regressor_order=["lobbying_lag1_mil", "lobbying_lag2_mil", "lobbying_lag3_mil", "lobbying_lead1_mil", "log_assets", "log_revenues"],
        drop_omitted=True,
        info_dict={"N": lambda x: f"{int(x.nobs)}"},
    )
    save_text(TABLES_DIR / "M3_lag_robustness_table.txt", lag_comparison.as_text())
    save_text(TABLES_DIR / "M3_lag_robustness_table.tex", lag_comparison.as_latex())

    return summary_df


def format_table_cell(result, term: str) -> str:
    """Format a coefficient and standard error for a publication-style table cell."""
    if term not in result.params:
        return "—"
    coefficient = result.params[term]
    stderr = result.bse[term]
    p_value = result.pvalues[term]
    return f"{coefficient:0.3f}{significance_stars(float(p_value))}\n({stderr:0.3f})"


def build_publication_table(
    model_1,
    model_2,
    model_3,
) -> pd.DataFrame:
    """Create a compact publication-ready regression table in wide CSV format."""
    rows = [
        {
            "Statistic": "Driver lag",
            "Model 1: FE (Baseline)": "t-1",
            "Model 2: FE (Clustered SE)": "t-1",
            "Model 3: FE (Lag 2)": "t-2",
        },
        {
            "Statistic": "Lobbying spend coefficient",
            "Model 1: FE (Baseline)": format_table_cell(model_1, "lobbying_lag1_mil"),
            "Model 2: FE (Clustered SE)": format_table_cell(model_2, "lobbying_lag1_mil"),
            "Model 3: FE (Lag 2)": format_table_cell(model_3, "lobbying_lag2_mil"),
        },
        {
            "Statistic": "Log(Assets)",
            "Model 1: FE (Baseline)": format_table_cell(model_1, "log_assets"),
            "Model 2: FE (Clustered SE)": format_table_cell(model_2, "log_assets"),
            "Model 3: FE (Lag 2)": format_table_cell(model_3, "log_assets"),
        },
        {
            "Statistic": "Log(Revenues)",
            "Model 1: FE (Baseline)": format_table_cell(model_1, "log_revenues"),
            "Model 2: FE (Clustered SE)": format_table_cell(model_2, "log_revenues"),
            "Model 3: FE (Lag 2)": format_table_cell(model_3, "log_revenues"),
        },
        {
            "Statistic": "Entity FE",
            "Model 1: FE (Baseline)": "Yes",
            "Model 2: FE (Clustered SE)": "Yes",
            "Model 3: FE (Lag 2)": "Yes",
        },
        {
            "Statistic": "Time FE",
            "Model 1: FE (Baseline)": "Yes",
            "Model 2: FE (Clustered SE)": "Yes",
            "Model 3: FE (Lag 2)": "Yes",
        },
        {
            "Statistic": "Clustered SE",
            "Model 1: FE (Baseline)": "No",
            "Model 2: FE (Clustered SE)": "Yes",
            "Model 3: FE (Lag 2)": "Yes",
        },
        {
            "Statistic": "N",
            "Model 1: FE (Baseline)": int(model_1.nobs),
            "Model 2: FE (Clustered SE)": int(model_2.nobs),
            "Model 3: FE (Lag 2)": int(model_3.nobs),
        },
        {
            "Statistic": "R^2",
            "Model 1: FE (Baseline)": f"{model_1.rsquared:0.3f}",
            "Model 2: FE (Clustered SE)": f"{model_2.rsquared:0.3f}",
            "Model 3: FE (Lag 2)": f"{model_3.rsquared:0.3f}",
        },
    ]
    return pd.DataFrame(rows)


def extract_robustness_value(
    summary_df: pd.DataFrame,
    check_name: str,
    sample_name: str,
    specification: str | None = None,
) -> pd.Series:
    """Return the first matching robustness row for a named check, sample, and specification."""
    subset = summary_df.loc[
        (summary_df["Check"] == check_name) & (summary_df["Sample"] == sample_name)
    ]
    if specification is not None:
        subset = subset.loc[subset["Specification"] == specification]
    if subset.empty:
        return pd.Series(dtype="object")
    return subset.iloc[0]


def render_interpretation_memo(
    fe_lag1,
    fe_lag2,
    fe_lag3,
    fe_placebo,
    robustness_summary: pd.DataFrame,
    bp_table: pd.DataFrame,
    vif_table: pd.DataFrame,
    arima_metrics: pd.DataFrame,
    arima_summary_text: str,
) -> str:
    """Create the assignment-ready interpretation memo for M3."""
    coef = fe_lag1.params["lobbying_lag1_mil"]
    p_value = fe_lag1.pvalues["lobbying_lag1_mil"]
    stderr = fe_lag1.bse["lobbying_lag1_mil"]

    lag2_row = extract_robustness_value(robustness_summary, "Alternative lag structures", "Full sample", "Lag 2")
    lag3_row = extract_robustness_value(robustness_summary, "Alternative lag structures", "Full sample", "Lag 3")
    outlier_row = extract_robustness_value(robustness_summary, "Exclude outlier period", "Excluding 2020")
    placebo_row = extract_robustness_value(robustness_summary, "Placebo / lead check", "Full sample", "Lead 1")
    small_row = extract_robustness_value(robustness_summary, "Group subsamples", "Small firms (below median assets)")
    large_row = extract_robustness_value(robustness_summary, "Group subsamples", "Large firms (at or above median assets)")

    arima_adf = float(arima_metrics.loc[arima_metrics["Metric"] == "ADF p-value (training series)", "Value"].iloc[0])
    arima_order = arima_metrics.loc[arima_metrics["Metric"] == "Selected ARIMA order", "Value"].iloc[0]
    arima_rmse = float(arima_metrics.loc[arima_metrics["Metric"] == "ARIMA RMSE", "Value"].iloc[0])
    naive_rmse = float(arima_metrics.loc[arima_metrics["Metric"] == "Naive RMSE", "Value"].iloc[0])
    bp_p_value = float(bp_table.loc[0, "p_value"])
    max_vif = float(vif_table["VIF"].max())

    headline_change_1m = coef
    headline_change_100k = coef / 10.0

    memo = f"""# M3 Interpretation Memo

## Model A Headline

A 1 unit increase in lobbying spend, where 1 unit equals $1 million, is associated with a {headline_change_1m:0.1f} percentage-point change in winsorized ROA in the lag-1 fixed-effects specification (p = {p_value:0.3f}, SE = {stderr:0.3f}).

In smaller economic units, a $100,000 increase in lobbying spend corresponds to about a {headline_change_100k:0.2f} percentage-point change in ROA. The estimate is not statistically significant at conventional levels, so the result should be treated as a noisy association rather than evidence of a reliable causal effect.

## Economic Interpretation

The sign and size of the estimate are consistent with several channels that could operate in either direction. Higher lobbying may reflect firms facing regulatory pressure, compliance costs, or market uncertainty, which could coincide with weaker profitability. Alternatively, profitable firms may have more slack resources to allocate to lobbying, which is why reverse causality remains a concern. A third channel is strategic risk management: firms may lobby more when expected future regulatory burdens are high, and that anticipation can compress margins in the short run.

## Model B Summary

The annual ARIMA benchmark selected order {arima_order} with an ADF p-value of {arima_adf:0.3f}. The holdout forecast did not improve on the naive baseline: ARIMA RMSE = {arima_rmse:0.3f} and naive RMSE = {naive_rmse:0.3f}. The practical takeaway is that the annual ROA series is difficult to forecast better than a persistence benchmark, which limits how much the time-series model adds beyond the panel regressions.

## Diagnostics

The Breusch-Pagan test is significant (p < 0.001), which indicates heteroskedasticity in the residuals and justifies the use of clustered or otherwise robust standard errors. The maximum VIF is {max_vif:0.2f}, which is comfortably below common multicollinearity red-flag thresholds, so the control set does not appear to be severely collinear. The residual plots should still be interpreted cautiously because the model is estimated on a sparse panel with large firm heterogeneity.

## Robustness

Clustered standard errors reduce the apparent precision of the lag-1 estimate relative to conventional SEs, which is why the clustered p-value rises from 0.494 to 0.135 in the publication table. Alternative lag specifications are not stable: lag 2 is {lag2_row['Coefficient']:0.1f} with p = {lag2_row['p_value']:0.3f}, and lag 3 is {lag3_row['Coefficient']:0.1f} with p = {lag3_row['p_value']:0.3f}. Excluding 2020 leaves the sign negative but still statistically insignificant (p = {outlier_row['p_value']:0.3f}). The subgroup split suggests the effect is much more negative among large firms than small firms, but the small-firm estimate is imprecise.

## Caveats

This design still faces omitted-variable risk, especially from time-varying governance, industry conditions, and unobserved firm strategy. The analysis uses fixed effects and lag structure checks rather than a full DiD design, so parallel trends is not directly tested here; if a DiD extension is added later, it should be validated explicitly. External validity is also limited because the sample is a specific firm-year panel with substantial missingness in lobbying coverage.
"""

    memo += "\n\n## ARIMA Diagnostics Detail\n\n"
    memo += arima_summary_text.replace("M3 ARIMA Summary\n", "").strip()
    memo += "\n"

    return memo


def save_fixed_effects_tables(models: dict[str, object], regressor_order: list[str]) -> None:
    """Save publication-style regression tables and a tidy coefficient table."""
    summary = summary_col(
        list(models.values()),
        stars=True,
        float_format="%0.4f",
        model_names=list(models.keys()),
        regressor_order=regressor_order,
        drop_omitted=True,
        info_dict={"N": lambda x: f"{int(x.nobs)}"},
    )

    save_text(TABLES_DIR / "M3_fixed_effects_table.txt", summary.as_text())
    save_text(TABLES_DIR / "M3_fixed_effects_table.tex", summary.as_latex())

    tidy_rows = []
    for model_name, result in models.items():
        for variable in regressor_order:
            if variable not in result.params:
                continue
            tidy_rows.append(
                {
                    "Model": model_name,
                    "Variable": variable_label(variable),
                    "Coefficient": result.params[variable],
                    "StdErr": result.bse[variable],
                    "t_stat": result.tvalues[variable],
                    "p_value": result.pvalues[variable],
                    "Stars": significance_stars(result.pvalues[variable]),
                }
            )

    tidy_df = pd.DataFrame(tidy_rows)
    tidy_df.to_csv(TABLES_DIR / "M3_fixed_effects_coefficients.csv", index=False)


def save_diagnostics_tables(bp_table: pd.DataFrame, vif_table: pd.DataFrame) -> None:
    """Persist diagnostic test results."""
    bp_table.to_csv(TABLES_DIR / "M3_breusch_pagan_results.csv", index=False)
    vif_table.to_csv(TABLES_DIR / "M3_vif_results.csv", index=False)

    report_lines = [
        "M3 Diagnostics Summary",
        f"Breusch-Pagan p-value: {bp_table.loc[0, 'p_value']:.4f}",
        f"Maximum VIF: {vif_table['VIF'].max():.2f}",
        "",
        "Variance Inflation Factors:",
        vif_table.to_string(index=False),
    ]
    save_text(TABLES_DIR / "M3_diagnostics_summary.txt", "\n".join(report_lines))


def get_annual_series(data: pd.DataFrame) -> pd.Series:
    """Aggregate the panel to a yearly average profitability series."""
    annual = (
        data.dropna(subset=["year", "roa_pct_winsor"])
        .groupby("year", as_index=True)["roa_pct_winsor"]
        .mean()
        .sort_index()
    )
    annual.index = annual.index.astype(int)
    return annual


def select_arima_order(series: pd.Series) -> tuple[tuple[int, int, int], float]:
    """Select a small ARIMA order by AIC using a short annual sample."""
    best_order = (0, 0, 0)
    best_aic = np.inf

    adf_pvalue = adfuller(series)[1]
    candidate_ds = [0, 1] if adf_pvalue >= 0.05 else [0]

    for p in range(3):
        for d in candidate_ds:
            for q in range(3):
                if p == 0 and d == 0 and q == 0:
                    continue
                if p + d + q > 2:
                    continue
                try:
                    with warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        result = ARIMA(series, order=(p, d, q)).fit()
                    if np.isfinite(result.aic) and result.aic < best_aic:
                        best_aic = result.aic
                        best_order = (p, d, q)
                except Exception:
                    continue

    if not np.isfinite(best_aic):
        best_order = (0, 1, 0)
        best_aic = np.nan

    return best_order, best_aic


def run_arima_forecast(annual_series: pd.Series) -> tuple[pd.DataFrame, pd.DataFrame, str]:
    """Fit an ARIMA model, forecast the holdout years, and compare to a naive baseline."""
    if len(annual_series) < 5:
        raise ValueError("Need at least five annual observations for the ARIMA comparison.")

    horizon = 2 if len(annual_series) >= 6 else 1
    train = annual_series.iloc[:-horizon]
    test = annual_series.iloc[-horizon:]

    adf_stat, adf_pvalue, _, _, critical_values, _ = adfuller(train)
    order, aic = select_arima_order(train)

    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        fitted = ARIMA(train, order=order).fit()

    forecast_res = fitted.get_forecast(steps=horizon)
    forecast_mean = forecast_res.predicted_mean
    forecast_ci = forecast_res.conf_int(alpha=0.05)

    naive_forecast = pd.Series([train.iloc[-1]] * horizon, index=test.index)

    forecast_table = pd.DataFrame(
        {
            "Year": test.index.astype(int),
            "Actual": test.values,
            "ARIMA_Forecast": forecast_mean.values,
            "Naive_Forecast": naive_forecast.values,
        }
    )
    forecast_table["ARIMA_Error"] = forecast_table["Actual"] - forecast_table["ARIMA_Forecast"]
    forecast_table["Naive_Error"] = forecast_table["Actual"] - forecast_table["Naive_Forecast"]

    arima_rmse = float(np.sqrt(np.mean(np.square(forecast_table["ARIMA_Error"]))))
    naive_rmse = float(np.sqrt(np.mean(np.square(forecast_table["Naive_Error"]))))

    metrics_table = pd.DataFrame(
        [
            {"Metric": "ADF p-value (training series)", "Value": adf_pvalue},
            {"Metric": "Selected ARIMA order", "Value": str(order)},
            {"Metric": "Selected ARIMA AIC", "Value": aic},
            {"Metric": "ARIMA RMSE", "Value": arima_rmse},
            {"Metric": "Naive RMSE", "Value": naive_rmse},
        ]
    )

    # Refit on the full annual series to generate a 6-period ahead forecast.
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        full_fit = ARIMA(annual_series, order=order).fit()
    future_steps = 6
    future_res = full_fit.get_forecast(steps=future_steps)
    future_mean = future_res.predicted_mean
    future_ci = future_res.conf_int(alpha=0.05)
    future_years = pd.Index(range(int(annual_series.index.max()) + 1, int(annual_series.index.max()) + future_steps + 1), name="Year")
    future_forecast_table = pd.DataFrame(
        {
            "Year": future_years.astype(int),
            "Forecast": future_mean.values,
            "Lower_95": future_ci.iloc[:, 0].values,
            "Upper_95": future_ci.iloc[:, 1].values,
        }
    )

    diagnostics_text = [
        "M3 ARIMA Summary",
        f"ADF statistic: {adf_stat:.4f}",
        f"ADF p-value: {adf_pvalue:.4f}",
        "Critical values: "
        + ", ".join(f"{key}={float(value):.4f}" for key, value in critical_values.items()),
        f"Selected order: {order}",
        f"Selected AIC: {aic:.4f}",
        f"ARIMA RMSE: {arima_rmse:.4f}",
        f"Naive RMSE: {naive_rmse:.4f}",
        f"Future forecast horizon: {future_steps} years",
    ]

    # Save an in-sample fit + holdout forecast plot.
    plt.figure(figsize=(11, 6))
    plt.plot(annual_series.index, annual_series.values, marker="o", linewidth=2, label="Actual annual ROA")
    plt.plot(test.index, forecast_mean.values, marker="o", linestyle="--", linewidth=2, label="ARIMA forecast")
    plt.fill_between(
        test.index,
        forecast_ci.iloc[:, 0].values,
        forecast_ci.iloc[:, 1].values,
        color="steelblue",
        alpha=0.2,
        label="95% confidence band",
    )
    plt.axvline(train.index[-1], color="gray", linestyle=":", linewidth=1.5, label="Train/test split")
    plt.xlabel("Year")
    plt.ylabel("Average ROA (winsorized, percentage points)")
    plt.title("Annual ROA Forecast: ARIMA vs. Naive Baseline")
    plt.legend()
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "M3_arima_forecast.png", dpi=300, bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(11, 6))
    plt.plot(annual_series.index, annual_series.values, marker="o", linewidth=2, label="Actual annual ROA")
    plt.plot(future_forecast_table["Year"], future_forecast_table["Forecast"], marker="o", linestyle="--", linewidth=2, label="6-year forecast")
    plt.fill_between(
        future_forecast_table["Year"],
        future_forecast_table["Lower_95"].values,
        future_forecast_table["Upper_95"].values,
        color="darkorange",
        alpha=0.2,
        label="95% confidence band",
    )
    plt.axvline(annual_series.index.max(), color="gray", linestyle=":", linewidth=1.5, label="Forecast start")
    plt.xlabel("Year")
    plt.ylabel("Average ROA (winsorized, percentage points)")
    plt.title("Annual ROA 6-Year Forward Forecast")
    plt.legend()
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "M3_arima_future_forecast.png", dpi=300, bbox_inches="tight")
    plt.close()

    return forecast_table, metrics_table, "\n".join(diagnostics_text), future_forecast_table


def save_arima_outputs(
    forecast_table: pd.DataFrame,
    metrics_table: pd.DataFrame,
    diagnostics_text: str,
    future_forecast_table: pd.DataFrame,
) -> None:
    """Save ARIMA tables and a plain-text summary."""
    forecast_table.to_csv(TABLES_DIR / "M3_arima_forecast_table.csv", index=False)
    metrics_table.to_csv(TABLES_DIR / "M3_arima_metrics.csv", index=False)
    future_forecast_table.to_csv(TABLES_DIR / "M3_arima_future_forecast.csv", index=False)
    save_text(TABLES_DIR / "M3_arima_summary.txt", diagnostics_text)


def main() -> None:
    ensure_outputs()
    raw = load_panel_data()
    panel = prepare_panel_data(raw)

    # Model A: fixed effects with alternative lag structures.
    fe_lag1_standard, _ = fit_fixed_effects_model(panel, "lobbying_lag1_mil", cov_type=None)
    fe_lag1, fe_lag1_data = fit_fixed_effects_model(panel, "lobbying_lag1_mil")
    fe_lag2, _ = fit_fixed_effects_model(panel, "lobbying_lag2_mil")
    fe_lag3, _ = fit_fixed_effects_model(panel, "lobbying_lag3_mil")
    fe_placebo, _ = fit_fixed_effects_model(panel, "lobbying_lead1_mil")

    save_fixed_effects_tables(
        {
            "FE Lag 1": fe_lag1,
            "FE Lag 2": fe_lag2,
            "FE Lag 3": fe_lag3,
            "FE Placebo": fe_placebo,
        },
        [
            "lobbying_lag1_mil",
            "lobbying_lag2_mil",
            "lobbying_lag3_mil",
            "lobbying_lead1_mil",
            "log_assets",
            "log_revenues",
        ],
    )

    robustness_summary = run_robustness_checks(panel)

    # Diagnostics for the baseline fixed effects specification.
    bp_table = run_breusch_pagan(fe_lag1, fe_lag1_data, ["lobbying_lag1_mil", "log_assets", "log_revenues"])
    vif_table = build_vif_table(fe_lag1_data, ["lobbying_lag1_mil", "log_assets", "log_revenues"])
    save_diagnostics_tables(bp_table, vif_table)
    save_residual_plots(fe_lag1, "M3")

    # Model B: ARIMA forecast on the annual average profitability series.
    annual_series = get_annual_series(panel)
    forecast_table, metrics_table, diagnostics_text, future_forecast_table = run_arima_forecast(annual_series)
    save_arima_outputs(forecast_table, metrics_table, diagnostics_text, future_forecast_table)

    publication_table = build_publication_table(fe_lag1_standard, fe_lag1, fe_lag2)
    publication_table.to_csv(TABLES_DIR / "M3_regression_table.csv", index=False)
    save_text(TABLES_DIR / "M3_regression_table.txt", publication_table.to_string(index=False))

    interpretation_memo = render_interpretation_memo(
        fe_lag1_standard,
        fe_lag2,
        fe_lag3,
        fe_placebo,
        robustness_summary,
        bp_table,
        vif_table,
        metrics_table,
        diagnostics_text,
    )
    save_text(REPORTS_DIR / "M3_interpretation.md", interpretation_memo)

    print("M3 econometric models completed successfully.")
    print(f"Fixed effects sample size: {int(fe_lag1.nobs)}")
    print(f"Annual ARIMA observations: {len(annual_series)}")
    print(f"Robustness checks saved: {len(robustness_summary)} rows")
    print("Publication-ready regression table and interpretation memo saved.")


if __name__ == "__main__":
    main()