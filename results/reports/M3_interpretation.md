# M3 Interpretation Memo

## 1. Model Specification and Identification

Model A is a two-way fixed effects panel regression with firm effects and year effects, estimated with clustered standard errors at the firm level. The focal predictor is lagged lobbying spend (t-1), and controls are log assets and log revenues.

Model B is an ARIMA benchmark on annual average ROA. It is included as an alternative predictive specification rather than a causal panel design.

## 2. Coefficient Interpretation (Economic Units)

In Model A, a $1 million increase in lobbying spend is associated with a -174.6 percentage-point change in winsorized ROA (SE = 255.299, p = 0.494).

Equivalent scaling:
- $100,000 increase -> -17.46 percentage points in ROA.
- $500,000 increase -> -87.29 percentage points in ROA.

Interpretation: the sign is negative, but the estimate is not statistically significant at conventional thresholds, so this is best interpreted as a directionally suggestive association, not precise causal evidence.

## 3. Diagnostics and What They Imply

- Heteroskedasticity: Breusch-Pagan is significant (p = 0.0000), so homoskedastic standard errors are not appropriate; clustered/robust inference is justified.
- Multicollinearity: max VIF is 2.74, below common concern thresholds, so coefficient instability from collinearity is limited.
- Residual shape: residual-vs-fitted and Q-Q diagnostics are exported and indicate non-ideal residual behavior consistent with a sparse, heterogeneous panel; inference should prioritize robust SEs.

## 4. Robustness Checks (Direct Comparison)

- Baseline clustered lag-1 estimate: beta = -174.6, p = 0.494.
- Alternative lags: lag-2 beta = -95.3 (p = 0.271); lag-3 beta = 38.5 (p = 0.648).
- Placebo lead test: lead-1 beta = -302.7 (p = 0.069); this flags potential timing/reverse-causality concerns that should be interpreted cautiously.
- Excluding 2020 shock year: beta = -109.2 (p = 0.131); sign remains negative.
- Heterogeneity split: small firms beta = -5753.9 (p = 0.156) vs large firms beta = -24.1 (p = 0.000), suggesting stronger adverse association in larger firms.

Overall robustness takeaway: coefficient sign is often negative, but magnitude and precision vary across timing and sample definitions.

## 5. Economic Mechanisms and Theory Link

Two mechanisms are consistent with the estimates:
- Financing-cost/leverage channel: policy exposure can raise effective financing costs and compress profitability.
- Discount-rate/valuation channel: higher required returns reduce present values of future cash flows and can coincide with lower measured operating outcomes.

Alternative explanations remain plausible: omitted time-varying firm strategy, industry demand shifts, and endogenous lobbying responses to anticipated shocks.

## 6. Model B (ARIMA) Interpretation

ARIMA selected order (0, 1, 0) with ADF p-value 0.229. Forecast accuracy did not beat the naive benchmark (ARIMA RMSE = 523.530, naive RMSE = 523.530), so time-series predictive gains are limited in this annual sample.

## 7. Bonus Extensions

- Three-way FE: firm FE + year FE + proxy-sector-by-year interactions gives lobbying beta = -159.5 (p = 0.367).
- Modern staggered-adoption DiD (Callaway-Sant'Anna style ATT(g,t)): mean ATT approximately -338.79 percentage points.
- Dynamic and heterogeneous treatment reporting: 3 event-time cells and 3 size-proxy subgroup summaries exported.
- Cluster bootstrap check: 95% percentile interval for lobbying effect = [-517.62, 149.65].

## 8. Caveats and Limits

Main limitations are omitted-variable risk, potential reverse causality, and limited treatment support in some DiD cells. Because explicit industry codes are unavailable in the merged panel, sector effects in bonus models use a documented size-based proxy. Results should be framed as robust associations under multiple specifications rather than definitive causal effects.


## ARIMA Diagnostics Detail

ADF statistic: -2.1401
ADF p-value: 0.2287
Critical values: 1%=-4.6652, 5%=-3.3672, 10%=-2.8030
Selected order: (0, 1, 0)
Selected AIC: 129.5193
ARIMA RMSE: 523.5305
Naive RMSE: 523.5305
Future forecast horizon: 6 years
