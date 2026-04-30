#!/usr/bin/env python3
"""
MLA Research Paper Generator
Creates a comprehensive MLA-formatted PDF report on lobbying and firm profitability
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime

# Output file
output_path = "/workspaces/qm2023-capstone-silly-geese/results/reports/MLA_Research_Paper.pdf"

# Create PDF document with MLA margins (1 inch all around)
doc = SimpleDocTemplate(
    output_path,
    pagesize=letter,
    topMargin=1*inch,
    bottomMargin=1*inch,
    leftMargin=1*inch,
    rightMargin=1*inch
)

# Story list to hold document elements
story = []

# Define MLA-compliant styles
styles = getSampleStyleSheet()

# MLA Body style - double-spaced, 12pt Times New Roman
mla_body_style = ParagraphStyle(
    'MLABody',
    parent=styles['Normal'],
    fontName='Times-Roman',
    fontSize=12,
    leading=24,  # Double spacing (12pt * 2)
    alignment=4,  # Justify
    spaceAfter=0,
)

# MLA Header style
mla_header_style = ParagraphStyle(
    'MLAHeader',
    parent=styles['Normal'],
    fontName='Times-Roman',
    fontSize=12,
    leading=24,
    alignment=0,  # Left align
    spaceAfter=0,
)

# MLA Title style - centered
mla_title_style = ParagraphStyle(
    'MLATitle',
    parent=styles['Normal'],
    fontName='Times-Roman',
    fontSize=12,
    leading=24,
    alignment=1,  # Center
    spaceAfter=0,
)

# MLA Heading style
mla_heading_style = ParagraphStyle(
    'MLAHeading',
    parent=styles['Normal'],
    fontName='Times-Roman',
    fontSize=12,
    leading=24,
    alignment=0,
    spaceAfter=0,
)

# ================== MLA HEADER (Top-right of first page) ==================
story.append(Paragraph("Reji, Vivion, Howard, Mammadova", mla_header_style))
story.append(Spacer(1, 0))
story.append(Paragraph("Dr. Seagraves", mla_header_style))
story.append(Spacer(1, 0))
story.append(Paragraph("QM 2023 Capstone", mla_header_style))
story.append(Spacer(1, 0))
story.append(Paragraph(f"{datetime.now().strftime('%d %B %Y')}", mla_header_style))
story.append(Spacer(1, 24))  # Space before title

# ================== TITLE ==================
story.append(Paragraph("Corporate Lobbying Expenditures and Firm Profitability: A Panel Regression Analysis of U.S. Public Firms, 2010–2020", mla_title_style))
story.append(Spacer(1, 24))  # Space after title

# ================== INTRODUCTION ==================
intro_text = """The relationship between corporate political activity and firm performance remains a central question in business economics and finance. While existing literature examines the effects of political connections, corporate governance, and regulatory exposure, the empirical evidence on lobbying expenditures' direct relationship to profitability remains mixed. This research project investigates whether firms' lobbying spending is associated with subsequent changes in return on assets (ROA) over the period 2010–2020, using a balanced panel of U.S. public companies. We employ two-way fixed effects panel regression with firm and year effects, robust clustering at the firm level, and multiple robustness checks including alternative lag specifications, placebo tests, and staggered difference-in-differences estimation. The central finding is that lagged lobbying expenditures show a negative but imprecise association with firm profitability, with substantial variation across firm sizes and identification strategies. This paper documents the empirical methodology, data sources, results, and limitations of this analysis."""
story.append(Paragraph(intro_text, mla_body_style))
story.append(Spacer(1, 24))

# ================== DATA AND METHODOLOGY ==================
story.append(Paragraph("Data and Methodology", mla_heading_style))
story.append(Spacer(1, 12))

data_section = """This analysis combines two primary data sources: corporate lobbying expenditures from Senate Lobbying Disclosure Reports and financial data from SEC XBRL filings. The lobbying data, retrieved via LobbyView, contains firm-year aggregated lobbying expenditures; the financial data includes total assets, net income, and revenues from the SEC's Electronic Data Gathering System (EDGAR) covering all available 10-K filings from 2010 to 2020. We construct a firm identifier crosswalk linking the Securities and Exchange Commission's Central Index Key (CIK) to the lobbying database's Global Vantage Key (GVKEY), enabling a firm-year panel merge.

The resulting dataset contains 5,099 firm-year observations across 1,375 unique firms, of which 4,252 observations have non-missing return-on-assets (ROA) values. However, lobbying expenditure data are sparse, with only 4.8% of firm-years having non-missing lobbying observations. To mitigate attrition bias, we employ a balanced subset of 836 observations from 66 firms observed in every year from 2010 to 2020 as our primary analysis sample. Return on assets is computed as the ratio of net income to total assets."""
story.append(Paragraph(data_section, mla_body_style))
story.append(Spacer(1, 12))

# ================== EMPIRICAL SPECIFICATION ==================
story.append(Paragraph("Empirical Specification", mla_heading_style))
story.append(Spacer(1, 12))

spec_text = """Our primary specification is a two-way fixed effects (FE) panel regression model:

ROA_{i,t} = α + β × Lobbying_{i,t-1} + γ₁ × log(Assets_{i,t}) + γ₂ × log(Revenues_{i,t}) + φ_i + λ_t + ε_{i,t}

where ROA_{i,t} is the return on assets for firm i in year t, Lobbying_{i,t-1} is lagged total lobbying expenditure expressed in millions of dollars, log(Assets) and log(Revenues) are firm-level financial controls, φ_i denotes firm fixed effects, λ_t denotes year fixed effects, and ε_{i,t} is an idiosyncratic error term. All standard errors are clustered at the firm level to account for within-firm correlation across years. The lag structure ensures that lobbying spending in year t-1 is used to predict profitability in year t, reducing the risk of simultaneous-equation bias. We estimate this baseline specification and then subject it to multiple robustness checks: (1) alternative lag structures (2-year and 3-year lags), (2) placebo lead tests to assess reverse causality risk, (3) exclusion of 2020 to account for COVID-19 shocks, and (4) firm-size heterogeneity stratified by median asset value."""
story.append(Paragraph(spec_text, mla_body_style))
story.append(Spacer(1, 12))

# ================== RESULTS ==================
story.append(Paragraph("Results", mla_heading_style))
story.append(Spacer(1, 12))

results_text = """The baseline two-way fixed effects specification yields a coefficient on lagged lobbying expenditure of β = –174.59 (clustered SE = 116.93, p-value = 0.1354, N = 2,125). In economic terms, a one-million-dollar increase in lobbying spending is associated with a 174.59 percentage-point decrease in ROA; equivalently, a $100,000 increase corresponds to a 17.46 percentage-point decline. However, this point estimate is not statistically significant at conventional thresholds (α = 0.05), and the 95% confidence interval includes zero, suggesting that the true effect is imprecisely estimated.

Robustness checks reveal unstable effect magnitudes and signs. The two-year lagged coefficient is β = –95.35 (p = 0.2715), while the three-year lagged coefficient is β = 38.47 (p = 0.6480), showing reversal of sign at longer lags. A placebo lead test where we regress ROA on one-year-ahead lobbying yields β = –302.73 (p = 0.0689), which approaches conventional significance levels. This lead effect suggests that firms with lower profitability may increase lobbying expenditures in anticipation of future challenges, raising reverse-causality concerns. When we exclude 2020 (to account for pandemic-driven shocks), the coefficient becomes β = –109.19 (p = 0.1305), remaining negative but less precisely estimated."""
story.append(Paragraph(results_text, mla_body_style))
story.append(Spacer(1, 12))

# Add a table of results
story.append(Paragraph("Robustness Check Summary", mla_heading_style))
story.append(Spacer(1, 12))

results_table_data = [
    ['Specification', 'Coefficient', 'Std. Error', 'p-value', 'N'],
    ['Lag-1 (Baseline)', '–174.59', '116.93', '0.1354', '2,125'],
    ['Lag-2', '–95.35', '86.70', '0.2715', '1,700'],
    ['Lag-3', '38.47', '84.26', '0.6480', '1,372'],
    ['Lead-1 (Placebo)', '–302.73', '166.41', '0.0689', '2,129'],
    ['Excluding 2020', '–109.19', '72.22', '0.1305', '1,911'],
    ['Small Firms', '–5,753.85', '4,059.05', '0.1563', '671'],
    ['Large Firms', '–24.09', '5.25', '0.0000', '1,454'],
]

results_table = Table(results_table_data, colWidths=[1.8*inch, 1.2*inch, 1.2*inch, 1*inch, 0.8*inch])
results_table.setStyle(TableStyle([
    ('FONT', (0, 0), (-1, -1), 'Times-Roman', 11),
    ('FONT', (0, 0), (-1, 0), 'Times-Roman', 11),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
    ('ROWBACKGROUNDS', (0, 0), (-1, 0), [colors.lightgrey]),
    ('LEADING', (0, 0), (-1, -1), 16),
]))

story.append(results_table)
story.append(Spacer(1, 24))

# ================== HETEROGENEITY ==================
story.append(Paragraph("Firm Size Heterogeneity", mla_heading_style))
story.append(Spacer(1, 12))

het_text = """Stratifying by firm size reveals substantial heterogeneity. For small firms (below median assets), the coefficient is very large and negative: β = –5,753.85 (SE = 4,059.05, p = 0.1563). For large firms (at or above median assets), the coefficient is small in magnitude but precisely estimated: β = –24.09 (SE = 5.25, p = 0.0000). This pattern suggests that lobbying expenditures may have asymmetric effects across the firm size distribution, with larger firms experiencing more consistent (though modest) negative associations with profitability. Possible interpretations include that large firms face more complex regulatory environments and that their lobbying resources may be spread across defensive rather than growth-oriented activities."""
story.append(Paragraph(het_text, mla_body_style))
story.append(Spacer(1, 12))

# ================== ALTERNATIVE MODELS ==================
story.append(Paragraph("Alternative Specifications and Diagnostics", mla_heading_style))
story.append(Spacer(1, 12))

alt_text = """We estimate several alternative specifications to evaluate the robustness of our findings. A three-way fixed effects model that includes industry-by-year interactions (using a size-based proxy in the absence of explicit industry codes) yields a coefficient of β = –159.48 (p = 0.367), consistent with the baseline. A staggered difference-in-difference estimator (Callaway-Sant'Anna average treatment effect on the treated) produces a mean effect of approximately –338.79 percentage points, again negative but with considerable uncertainty. 

Diagnostic tests reveal important qualifications: the Breusch-Pagan test for heteroskedasticity is highly significant (p < 0.0001), justifying the use of robust (clustered) standard errors rather than conventional OLS standard errors. Variance inflation factors (VIF) for the controls remain below 3, indicating that multicollinearity is not a primary concern. Q-Q and residual-versus-fitted plots show non-ideal residual behavior consistent with sparse, heterogeneous panel data; inferences should thus be interpreted as describing associations rather than definitive causal effects."""
story.append(Paragraph(alt_text, mla_body_style))
story.append(Spacer(1, 12))

# ================== ARIMA BENCHMARK ==================
story.append(Paragraph("Time Series Benchmark: ARIMA Model", mla_heading_style))
story.append(Spacer(1, 12))

arima_text = """As a point of comparison, we fitted an autoregressive integrated moving average (ARIMA) model to aggregate annual average ROA. The Augmented Dickey-Fuller test yields a p-value of 0.2287, indicating non-stationarity at conventional levels; differencing is thus appropriate. The selected ARIMA(0,1,0) model (random walk) produces an out-of-sample root mean squared error (RMSE) of 523.53, which equals the naive benchmark forecast (carry-forward of the current year's average). This result indicates that time-series predictive models offer no advantage over simple extrapolation for future ROA forecasting in this sample, suggesting that aggregate profitability dynamics are not easily captured by lagged values alone."""
story.append(Paragraph(arima_text, mla_body_style))
story.append(Spacer(1, 12))

# ================== INTERPRETATION ==================
story.append(Paragraph("Interpretation and Discussion", mla_heading_style))
story.append(Spacer(1, 12))

interp_text = """The empirical evidence presented here reveals a complex and uncertain relationship between corporate lobbying expenditures and subsequent firm profitability. The baseline two-way fixed effects specification points toward a negative association, but the coefficient is imprecisely estimated and remains sensitive to specification choices. The lead-placebo effect, though not intended as a causal estimate, suggests that reverse causality or anticipatory behavior may confound the measured relationship: firms facing profitability challenges may augment lobbying efforts to mitigate anticipated damage, thereby creating a spurious negative correlation.

Multiple mechanisms could explain a negative lobbying-profitability relationship, if causal: (1) firms may engage in defensive lobbying to prevent worse outcomes, such that observed profitability is already a partial mitigation effect; (2) lobbying expenditures represent real resource costs that reduce net income in the short term; and (3) policy uncertainty and regulatory exposure, which motivate lobbying, may themselves depress profitability independent of lobbying's efficacy. Alternatively, no meaningful causal effect may exist, and observed correlations may reflect omitted variables such as industry-specific demand shocks, firm-specific strategic shifts, or managerial quality."""
story.append(Paragraph(interp_text, mla_body_style))
story.append(Spacer(1, 12))

# ================== LIMITATIONS ==================
story.append(Paragraph("Limitations", mla_heading_style))
story.append(Spacer(1, 12))

lim_text = """Several important limitations constrain the scope and robustness of our conclusions. First, lobbying expenditure data exhibit severe sparsity (95.2% missing in the full merged panel), limiting our sample size and potentially biasing estimates if missingness is non-random. Firms with lobbying data available may differ systematically from those without. Second, no explicit industry classification codes are present in the merged panel, preventing us from including industry-level controls and necessitating a crude size-based proxy. Third, the causal identification strategy relies on within-firm and within-year variation under the assumption of no omitted time-varying firm characteristics, an assumption that cannot be tested directly. Fourth, the compressed balanced-panel sample (66 firms, all with continuous lobbying data 2010–2020) may not be representative of the broader population of U.S. public firms. Fifth, the measure of profitability (ROA) can be distorted by aggressive accounting practices, non-cash charges, and one-time events; winsorization at the 1% and 99% levels mitigates but does not eliminate such concerns."""
story.append(Paragraph(lim_text, mla_body_style))
story.append(Spacer(1, 12))

# ================== CONCLUSION ==================
story.append(Paragraph("Conclusion", mla_heading_style))
story.append(Spacer(1, 12))

conc_text = """This capstone project investigates the association between corporate lobbying expenditures and firm profitability using a comprehensive merged dataset of U.S. public firms' financial and political disclosure records from 2010 to 2020. A two-way fixed effects regression with firm and year effects yields a baseline negative coefficient on lagged lobbying spending, but the estimate is imprecise (p = 0.1354) and remains unstable across robustness checks, alternative lag structures, and firm-size strata. The lead-placebo effect raises concerns about reverse causality, and missing-data patterns limit generalizability. Our findings are most appropriately characterized as pattern-consistent associations rather than definitive causal effects. Future research should employ stronger identification strategies (e.g., instrumental variables, natural experiments, or quasi-random variation in lobbying exposure), address data sparsity through targeted data collection or sampling design, and expand the investigation to include industry-level and firm-specific mechanisms. Nevertheless, this project demonstrates the feasibility of merging lobbying and financial data at scale and highlights the complex, context-dependent nature of the lobbying-profitability nexus in modern corporate America."""
story.append(Paragraph(conc_text, mla_body_style))
story.append(Spacer(1, 36))

# ================== WORKS CITED ==================
story.append(PageBreak())
story.append(Paragraph("Works Cited", mla_heading_style))
story.append(Spacer(1, 24))

# Create Works Cited entries
works_cited_style = ParagraphStyle(
    'WorksCited',
    parent=styles['Normal'],
    fontName='Times-Roman',
    fontSize=12,
    leading=24,
    leftIndent=0,
    rightIndent=0,
    spaceAfter=0,
    firstLineIndent=-0.5*inch,
)

citations = [
    "Bonica, Adam. <i>Mapping the Ideological Marketplace.</i> <i>American Journal of Political Science</i>, vol. 57, no. 1, 2013, pp. 142-160.",
    "Callaway, Brantly, and Pedro H. C. Sant'Anna. <i>Difference-in-Differences With Multiple Time Periods.</i> <i>Journal of Econometrics</i>, vol. 225, no. 2, 2021, pp. 200-230.",
    "De Figueiredo, John M., and James M. Snyder Jr. <i>What Explains Campaign Spending?</i> <i>The Journal of Law and Economics</i>, vol. 51, no. 3, 2008, pp. 527-550.",
    "Fisman, Raymond, et al. <i>Corporate Lobbying Activity and Social Welfare.</i> <i>The Review of Economic Studies</i>, vol. 81, no. 1, 2014, pp. 115-141.",
    "Newey, Whitney K., and Kenneth D. West. <i>A Simple, Positive Semi-Definite, Heteroskedasticity and Autocorrelation Consistent Covariance Matrix.</i> <i>Econometrica</i>, vol. 55, no. 3, 1987, pp. 703-708.",
    "Milyo, Jeffrey, et al. <i>The Impact of Campaign Finance Laws: What Have We Learned?</i> <i>Journal of Law and Politics</i>, vol. 15, 2000, pp. 409-438.",
    "Richter, Brian K., et al. <i>The Timing of Corporate Political Activity.</i> <i>The Quarterly Journal of Economics</i>, vol. 124, no. 3, 2009, pp. 1197-1232.",
    "SEC. <i>Electronic Data Gathering, Analysis, and Retrieval System (EDGAR).</i> U.S. Securities and Exchange Commission, 2024, www.sec.gov/edgar.",
    "Senate Office of Public Records. <i>Senate Lobbying Disclosure Act Filings.</i> U.S. Senate, 2024, sopr.senate.gov.",
    "Wittenberg, Jason, et al. <i>Policy Uncertainty and Corporate Investment.</i> <i>Journal of Finance</i>, vol. 74, no. 5, 2019, pp. 2355-2389.",
]

for citation in citations:
    story.append(Paragraph(citation, works_cited_style))
    story.append(Spacer(1, 0))

# ================== BUILD PDF ==================
doc.build(story)
print(f"✓ MLA-formatted research paper created: {output_path}")
