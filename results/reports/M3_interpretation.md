# M3 Interpretation Memo

## Model A Headline

A 1 unit increase in lobbying spend, where 1 unit equals $1 million, is associated with a -174.6 percentage-point change in winsorized ROA in the lag-1 fixed-effects specification (p = 0.494, SE = 255.299).

In smaller economic units, a $100,000 increase in lobbying spend corresponds to about a -17.46 percentage-point change in ROA. The estimate is not statistically significant at conventional levels, so the result should be treated as a noisy association rather than evidence of a reliable causal effect.

## Economic Interpretation

The sign and size of the estimate are consistent with several channels that could operate in either direction. Higher lobbying may reflect firms facing regulatory pressure, compliance costs, or market uncertainty, which could coincide with weaker profitability. Alternatively, profitable firms may have more slack resources to allocate to lobbying, which is why reverse causality remains a concern. A third channel is strategic risk management: firms may lobby more when expected future regulatory burdens are high, and that anticipation can compress margins in the short run.

## Model B Summary

The annual ARIMA benchmark selected order (0, 1, 0) with an ADF p-value of 0.229. The holdout forecast did not improve on the naive baseline: ARIMA RMSE = 523.530 and naive RMSE = 523.530. The practical takeaway is that the annual ROA series is difficult to forecast better than a persistence benchmark, which limits how much the time-series model adds beyond the panel regressions.

## Diagnostics

The Breusch-Pagan test is significant (p < 0.001), which indicates heteroskedasticity in the residuals and justifies the use of clustered or otherwise robust standard errors. The maximum VIF is 2.74, which is comfortably below common multicollinearity red-flag thresholds, so the control set does not appear to be severely collinear. The residual plots should still be interpreted cautiously because the model is estimated on a sparse panel with large firm heterogeneity.

## Robustness

Clustered standard errors reduce the apparent precision of the lag-1 estimate relative to conventional SEs, which is why the clustered p-value rises from 0.494 to 0.135 in the publication table. Alternative lag specifications are not stable: lag 2 is -95.3 with p = 0.271, and lag 3 is 38.5 with p = 0.648. Excluding 2020 leaves the sign negative but still statistically insignificant (p = 0.131). The subgroup split suggests the effect is much more negative among large firms than small firms, but the small-firm estimate is imprecise.

## Caveats

This design still faces omitted-variable risk, especially from time-varying governance, industry conditions, and unobserved firm strategy. The analysis uses fixed effects and lag structure checks rather than a full DiD design, so parallel trends is not directly tested here; if a DiD extension is added later, it should be validated explicitly. External validity is also limited because the sample is a specific firm-year panel with substantial missingness in lobbying coverage.


## ARIMA Diagnostics Detail

ADF statistic: -2.1401
ADF p-value: 0.2287
Critical values: 1%=-4.6652, 5%=-3.3672, 10%=-2.8030
Selected order: (0, 1, 0)
Selected AIC: 129.5193
ARIMA RMSE: 523.5305
Naive RMSE: 523.5305
Future forecast horizon: 6 years
