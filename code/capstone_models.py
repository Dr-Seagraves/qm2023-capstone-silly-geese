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

from config_paths import FINAL_DATA_DIR, FIGURES_DIR, TABLES_DIR


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
    data["lobbying_lead1_mil"] = group["lobbying_spend_mil"].shift(-1)

    # Auxiliary controls for robustness and the predictive comparison.
    data["asset_growth"] = group["Assets"].pct_change()
    data["revenue_growth"] = group["Revenues"].pct_change()

    return data


def fit_fixed_effects_model(data: pd.DataFrame, lag_col: str):
    """Fit a two-way fixed effects regression with clustered standard errors."""
    model_data = data.dropna(
        subset=["roa_pct_winsor", lag_col, "log_assets", "log_revenues", "cik", "year"]
    ).copy()

    formula = (
        f"roa_pct_winsor ~ {lag_col} + log_assets + log_revenues + C(cik) + C(year)"
    )
    model = smf.ols(formula=formula, data=model_data).fit(
        cov_type="cluster", cov_kwds={"groups": model_data["cik"]}
    )
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
    fe_lag1, fe_lag1_data = fit_fixed_effects_model(panel, "lobbying_lag1_mil")
    fe_lag2, _ = fit_fixed_effects_model(panel, "lobbying_lag2_mil")
    fe_placebo, _ = fit_fixed_effects_model(panel, "lobbying_lead1_mil")

    save_fixed_effects_tables(
        {
            "FE Lag 1": fe_lag1,
            "FE Lag 2": fe_lag2,
            "FE Placebo": fe_placebo,
        },
        ["lobbying_lag1_mil", "lobbying_lag2_mil", "lobbying_lead1_mil", "log_assets", "log_revenues"],
    )

    # Diagnostics for the baseline fixed effects specification.
    bp_table = run_breusch_pagan(fe_lag1, fe_lag1_data, ["lobbying_lag1_mil", "log_assets", "log_revenues"])
    vif_table = build_vif_table(fe_lag1_data, ["lobbying_lag1_mil", "log_assets", "log_revenues"])
    save_diagnostics_tables(bp_table, vif_table)
    save_residual_plots(fe_lag1, "M3")

    # Model B: ARIMA forecast on the annual average profitability series.
    annual_series = get_annual_series(panel)
    forecast_table, metrics_table, diagnostics_text, future_forecast_table = run_arima_forecast(annual_series)
    save_arima_outputs(forecast_table, metrics_table, diagnostics_text, future_forecast_table)

    print("M3 econometric models completed successfully.")
    print(f"Fixed effects sample size: {int(fe_lag1.nobs)}")
    print(f"Annual ARIMA observations: {len(annual_series)}")


if __name__ == "__main__":
    main()