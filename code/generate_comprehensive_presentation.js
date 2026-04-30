#!/usr/bin/env node
/**
 * Generate Comprehensive Capstone Research Presentation
 * Covers M1 (Data), M2 (EDA), and M3 (Results) with proper formatting and bullet points
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Initialize presentation
const prs = new PptxGenJS();
prs.defineLayout({ name: 'LAYOUT_WIDE', width: 10, height: 7.5 });
prs.layout = 'LAYOUT_WIDE';

// Color scheme
const colors = {
  navy: '102A43',
  lightBlue: 'DCEEFF',
  white: 'FFFFFF',
  darkText: '24364B',
  mediumText: '5F7084',
  accent: '58A6FF',
  background: 'F3F8FD',
};

// Helper functions
function addSlide() {
  return prs.addSlide();
}

function addBackground(slide) {
  slide.background = { fill: colors.background };
}

function addTopLabel(slide, text) {
  slide.addShape(prs.ShapeType.roundRect, {
    x: 0.35,
    y: 0.2,
    w: 1,
    h: 0.25,
    rectRadius: 0.04,
    fill: { color: colors.lightBlue },
    line: { color: colors.lightBlue, pt: 0 },
  });
  slide.addText(text, {
    x: 0.35,
    y: 0.22,
    w: 1,
    h: 0.22,
    fontFace: 'Trebuchet MS',
    fontSize: 8,
    bold: true,
    color: colors.navy,
    align: 'center',
    margin: 0,
  });
}

function addSlideTitle(slide, title) {
  slide.addText(title, {
    x: 0.35,
    y: 0.6,
    w: 9.3,
    h: 0.4,
    fontFace: 'Trebuchet MS',
    fontSize: 28,
    bold: true,
    color: colors.navy,
    align: 'left',
    margin: 0,
  });
}

function addCard(slide, x, y, w, h, bgColor, borderColor, borderPt = 0.07) {
  slide.addShape(prs.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: bgColor },
    line: { color: borderColor, pt: borderPt },
    shadow: {
      type: 'outer',
      angle: 45,
      blur: 3,
      color: '000000',
      opacity: 0.2,
    },
  });
}

function addBulletText(slide, x, y, w, h, bullets, fontSize = 11) {
  const bulletTexts = bullets.map(b => `• ${b}`).join('\n');
  slide.addText(bulletTexts, {
    x, y, w, h,
    fontFace: 'Aptos',
    fontSize,
    color: colors.darkText,
    align: 'left',
    valign: 'top',
    margin: [0.1, 0.15, 0.1, 0.15],
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.35,
    y: 7.1,
    w: 9.3,
    h: 0.25,
    fontFace: 'Aptos',
    fontSize: 8,
    italic: true,
    color: colors.mediumText,
    align: 'center',
    margin: 0,
  });
}

// ===== SLIDE 1: TITLE SLIDE =====
let slide = addSlide();
addBackground(slide);

slide.addText('Corporate Lobbying and Firm Profitability', {
  x: 0.35,
  y: 2.8,
  w: 9.3,
  h: 0.6,
  fontFace: 'Trebuchet MS',
  fontSize: 44,
  bold: true,
  color: colors.navy,
  align: 'center',
});

slide.addText('A Comprehensive Panel Analysis of U.S. Public Firms (2010–2020)', {
  x: 0.35,
  y: 3.5,
  w: 9.3,
  h: 0.4,
  fontFace: 'Aptos',
  fontSize: 18,
  color: colors.mediumText,
  align: 'center',
});

slide.addText('Alycia Reji • Gracie Vivion • Shelby Howard • Daniz Mammadova\nQM 2023 Capstone Project', {
  x: 0.35,
  y: 4.2,
  w: 9.3,
  h: 0.6,
  fontFace: 'Aptos',
  fontSize: 12,
  color: colors.darkText,
  align: 'center',
});

// ===== SLIDE 2: RESEARCH QUESTION & OBJECTIVES =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'M1 & Overview');
addSlideTitle(slide, 'Research Question and Objectives');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Primary Research Question:', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.3,
  fontFace: 'Trebuchet MS',
  fontSize: 14,
  bold: true,
  color: colors.navy,
});

slide.addText('What is the relationship between firms\' lobbying expenditures and their subsequent profitability?', {
  x: 0.65,
  y: 1.7,
  w: 8.7,
  h: 0.5,
  fontFace: 'Aptos',
  fontSize: 12,
  italic: true,
  color: colors.mediumText,
});

slide.addText('Key Objectives:', {
  x: 0.65,
  y: 2.35,
  w: 8.7,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const objectives = [
  'Merge lobbying expenditure data with firm financial records (2010–2020)',
  'Conduct exploratory data analysis to identify patterns and relationships',
  'Estimate panel regression models with fixed effects and robust inference',
  'Perform robustness checks across lag structures, sample subsets, and firm sizes',
  'Interpret findings within theoretical frameworks of corporate political activity',
];

addBulletText(slide, 0.8, 2.65, 8.4, 3.9, objectives, 11);

// ===== SLIDE 3: DATA SOURCES AND INTEGRATION =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Milestone 1');
addSlideTitle(slide, 'Data Sources and Integration');

addCard(slide, 0.35, 1.15, 4.4, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Lobbying Data', {
  x: 0.55,
  y: 1.35,
  w: 4,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const lobbyingPoints = [
  'Source: Senate Lobbying Disclosure Reports (LobbyView)',
  'Unit: Firm-year observations',
  'Period: 2010–2020',
  'Key variable: Annual total lobbying expenditure (USD)',
  'Coverage: 1,534 unique firms',
];

addBulletText(slide, 0.55, 1.65, 4, 3.15, lobbyingPoints, 9.5);

addCard(slide, 5.25, 1.15, 4.4, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Financial Data', {
  x: 5.45,
  y: 1.35,
  w: 4,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const financialPoints = [
  'Source: SEC XBRL filings (10-K annual reports)',
  'Unit: Firm-year observations',
  'Period: 2010–2020',
  'Key variables: Total Assets, Net Income, Revenues',
  'Coverage: 1,375 unique firms',
];

addBulletText(slide, 5.45, 1.65, 4, 3.15, financialPoints, 9.5);

slide.addText('After merge: 5,099 firm-year observations across 1,375 firms; balanced panel yielded 836 observations (66 firms with complete 2010–2020 data)', {
  x: 0.35,
  y: 6.75,
  w: 9.3,
  h: 0.9,
  fontFace: 'Aptos',
  fontSize: 10,
  color: colors.mediumText,
  align: 'left',
});

// ===== SLIDE 4: M2 EDA - DESCRIPTIVE STATISTICS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Milestone 2');
addSlideTitle(slide, 'Exploratory Data Analysis: Key Patterns');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Descriptive Findings from M2:', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 13,
  bold: true,
  color: colors.navy,
});

const edaPoints = [
  'Positive moderate correlation between lobbying expenditure and firm performance (Return on Assets)',
  'Effect exhibits time lag: strongest association at 1–2-year lags, not contemporaneous',
  'Heterogeneous effects: stronger in larger and policy-exposed firms',
  'Smaller firms show weaker or no relationship; size-based mechanism likely relevant',
  'Outlier firms with extreme lobbying spending have disproportionate leverage on results',
  'Log-scaling and trimming reduce magnitude but preserve positive direction in most cases',
  'Adding controls (size, industry, year effects) attenuates coefficient but does not eliminate it',
];

addBulletText(slide, 0.8, 1.7, 8.4, 4.8, edaPoints, 10.5);

addFooter(slide, 'M2 Hypothesis Development: Positive effect expected, strongest at lag 1–2, larger for big firms');

// ===== SLIDE 5: DATA QUALITY & SAMPLE OVERVIEW =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Data Quality');
addSlideTitle(slide, 'Sample Characteristics and Coverage');

// Left table
const dataTable = [
  ['Dataset', 'Rows', 'Unique Firms', 'Key Identifier'],
  ['Financials', '4,932', '1,375', 'CIK'],
  ['Lobbying', '11,619', '1,534', 'GVKEY'],
  ['Merged (Full)', '5,099', '1,375', 'CIK'],
  ['Balanced Panel', '836', '66', 'CIK, 2010–2020'],
];

const tbl = slide.addTable(dataTable, {
  x: 0.35,
  y: 1.15,
  w: 9.3,
  h: 2.2,
  border: { pt: 1, color: colors.lightBlue },
  fill: colors.white,
  align: 'center',
  valign: 'middle',
  fontFace: 'Aptos',
  fontSize: 10,
  headerFill: colors.navy,
  headerFontColor: colors.white,
  margin: [0.08, 0.08, 0.08, 0.08],
});

slide.addText('Data Quality Notes:', {
  x: 0.35,
  y: 3.5,
  w: 9.3,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const qualityNotes = [
  'Lobbying data sparse: 95.2% missing in full merged panel (many firms not in lobbying universe)',
  'Mean ROA: 56.94 (winsorized); highly variable due to outliers and firm heterogeneity',
  'No explicit industry codes; size-based proxy used for heterogeneity estimation',
  'Balanced panel (66 firms) is subset of full sample; may not be representative of all firms',
];

addBulletText(slide, 0.35, 3.85, 9.3, 2.9, qualityNotes, 10);

// ===== SLIDE 6: M3 MAIN RESULTS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Milestone 3');
addSlideTitle(slide, 'Main Econometric Results');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Two-Way Fixed Effects Panel Regression (Firm and Year FE, Clustered SEs)', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.3,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const mainResults = [
  'Baseline coefficient (lagged lobbying): β = –174.59 (SE = 116.93, p = 0.1354, N = 2,125)',
  'Economic interpretation: $1M increase in lobbying → 174.59 percentage-point decrease in ROA',
  'Equivalent: $100K increase → 17.46 percentage-point decline in ROA',
  'Not statistically significant at α = 0.05; 95% confidence interval includes zero',
  'Conclusion: Negative point estimate, but imprecise and not robust to specification changes',
];

addBulletText(slide, 0.8, 1.75, 8.4, 3.8, mainResults, 10.5);

slide.addShape(prs.ShapeType.roundRect, {
  x: 0.65,
  y: 5.7,
  w: 8.4,
  h: 1,
  rectRadius: 0.08,
  fill: { color: '#FFF3CD' },
  line: { color: '#FFD700', pt: 0.05 },
});

slide.addText('⚠ Key Finding: Evidence for negative association is weaker than EDA\'s positive findings, suggesting alternative mechanisms or model sensitivity.', {
  x: 0.8,
  y: 5.8,
  w: 8.1,
  h: 0.8,
  fontFace: 'Aptos',
  fontSize: 10,
  color: colors.darkText,
  align: 'left',
});

// ===== SLIDE 7: ROBUSTNESS CHECKS SUMMARY =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Robustness');
addSlideTitle(slide, 'Robustness Checks: Coefficient Stability');

const robustTable = [
  ['Specification', 'Coefficient', 'SE', 'p-value', 'N'],
  ['Baseline (Lag 1)', '–174.59', '116.93', '0.1354', '2,125'],
  ['Lag 2', '–95.35', '86.70', '0.2715', '1,700'],
  ['Lag 3', '38.47', '84.26', '0.6480', '1,372'],
  ['Lead 1 (Placebo)', '–302.73', '166.41', '0.0689', '2,129'],
  ['Excluding 2020', '–109.19', '72.22', '0.1305', '1,911'],
  ['Small Firms', '–5,753.85', '4,059.05', '0.1563', '671'],
  ['Large Firms', '–24.09', '5.25', '0.0000', '1,454'],
];

const robustTbl = slide.addTable(robustTable, {
  x: 0.35,
  y: 1.15,
  w: 9.3,
  h: 3.7,
  border: { pt: 0.5, color: colors.lightBlue },
  fill: colors.white,
  align: 'center',
  valign: 'middle',
  fontFace: 'Aptos',
  fontSize: 9,
  headerFill: colors.navy,
  headerFontColor: colors.white,
  margin: [0.06, 0.08, 0.06, 0.08],
});

slide.addText('Interpretation:', {
  x: 0.35,
  y: 4.95,
  w: 9.3,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.navy,
});

const interpPoints = [
  'Sign consistency: Negative across lags 1–2; positive at lag 3 suggests direction instability',
  'Lead effect significant at p < 0.10 raises reverse-causality concerns: lower profitability may prompt lobbying',
  'Heterogeneity: Small firms show extreme, imprecise effect; large firms show consistent, negative effect (p < 0.001)',
  'Excluding 2020 maintains negative direction but reduces precision, suggesting COVID-19 did not drive main result',
];

addBulletText(slide, 0.35, 5.25, 9.3, 1.65, interpPoints, 9.5);

// ===== SLIDE 8: FIRM SIZE HETEROGENEITY =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Heterogeneity');
addSlideTitle(slide, 'Differential Effects by Firm Size');

addCard(slide, 0.35, 1.15, 4.4, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Large Firms', {
  x: 0.55,
  y: 1.35,
  w: 4,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const largePoints = [
  'Coefficient: β = –24.09 (SE = 5.25, p < 0.001)',
  'Precisely estimated; statistically significant',
  'Small magnitude but consistent',
  'Interpretation: Defensive lobbying by larger, more exposed firms',
];

addBulletText(slide, 0.55, 1.65, 4, 4.5, largePoints, 9.5);

addCard(slide, 5.25, 1.15, 4.4, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Small Firms', {
  x: 5.45,
  y: 1.35,
  w: 4,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const smallPoints = [
  'Coefficient: β = –5,753.85 (SE = 4,059.05, p = 0.156)',
  'Very large magnitude but imprecise',
  'Not statistically significant',
  'Likely driven by few extreme spenders; high noise in small-firm lobbying',
];

addBulletText(slide, 5.45, 1.65, 4, 4.5, smallPoints, 9.5);

addFooter(slide, 'Pattern suggests: Larger firms\' lobbying may reflect strategic regulatory engagement; smaller firms show sparse, ad hoc behavior.');

// ===== SLIDE 9: ALTERNATIVE SPECIFICATIONS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Extensions');
addSlideTitle(slide, 'Alternative Specifications and Diagnostics');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

const altSpecs = [
  'Three-way FE with industry-by-year interactions: β = –159.48 (p = 0.367) — sign remains negative, precision similar to baseline',
  'Staggered difference-in-differences (Callaway-Sant\'Anna): Average treatment effect ≈ –338.79 pp; large, negative, but uncertain',
  'Cluster bootstrap 95% CI: [–517.62, 149.65] — wide interval spans positive and negative, confirming low precision',
  'Breusch-Pagan test for heteroskedasticity: p < 0.0001; justifies clustered SEs over homoskedastic OLS',
  'Variance Inflation Factors (VIF) for controls: max 2.74; multicollinearity not a concern',
  'Diagnostic plots (Q-Q, residvals-vs-fitted): suggest non-ideal residual behavior; pattern consistent with sparse, heterogeneous panel',
];

addBulletText(slide, 0.65, 1.35, 8.7, 5.35, altSpecs, 10);

// ===== SLIDE 10: ARIMA BENCHMARK =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Benchmark');
addSlideTitle(slide, 'Time-Series Benchmark: ARIMA Model');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('ARIMA(0,1,0) Specification (Random Walk with Differencing):', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.28,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const arimaPoints = [
  'Augmented Dickey-Fuller test: p-value = 0.2287 (non-stationary; differencing applied)',
  'Selected order: (0, 1, 0) based on AIC minimization',
  'Out-of-sample RMSE: 523.53',
  'Naive benchmark RMSE (carry-forward) : 523.53',
  'No predictive gain from ARIMA vs. simple extrapolation; aggregate ROA trends not easily forecasted by lags alone',
  '→ Implication: Annual aggregate profitability dynamics driven by factors other than recent own history',
];

addBulletText(slide, 0.8, 1.75, 8.4, 4.8, arimaPoints, 10.5);

// ===== SLIDE 11: MECHANISMS & INTERPRETATION =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Discussion');
addSlideTitle(slide, 'Mechanisms and Interpretation');

addCard(slide, 0.35, 1.15, 4.4, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Possible Explanations', {
  x: 0.55,
  y: 1.35,
  w: 4,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.navy,
});

const mechPoints = [
  'Defensive lobbying: Firms spend on lobbying to prevent worse outcomes',
  'Policy uncertainty: Regulatory exposure drives both lobbying and lower measured profitability',
  'Selection effect: Worse-performing firms spend more on lobbying (reverse causality)',
  'Omitted factors: Industry shocks or managerial quality confound the relationship',
];

addBulletText(slide, 0.55, 1.65, 4, 4.8, mechPoints, 9);

addCard(slide, 5.25, 1.15, 4.4, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Data Interpretation', {
  x: 5.45,
  y: 1.35,
  w: 4,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.navy,
});

const dataInterpPoints = [
  'M2 EDA findings (positive correlation) differ from M3 results (negative association)',
  'Likely caused by: omitted variable bias, firm fixed effects absorbing selection effects, reverse causality',
  'Lead-placebo effect (p = 0.069) is red flag for temporal ordering assumptions',
  'Results best framed as associations, not causal effects',
];

addBulletText(slide, 5.45, 1.65, 4, 4.8, dataInterpPoints, 9);

// ===== SLIDE 12: LIMITATIONS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Limitations');
addSlideTitle(slide, 'Project Constraints and Caveats');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

const limitations = [
  'Data sparsity: 95.2% missing lobbying values; sample likely non-random and unrepresentative',
  'Balanced panel: Only 66 firms with complete 2010–2020 data; severe attrition can introduce bias',
  'No industry codes: Crude size-based proxy used; omits sector-specific policy exposure dynamics',
  'Causal identification: Relies on within-firm variation and time fixed effects; no exogenous variation exploited',
  'Outlier dependence: Effect size (especially for small firms) driven by few extreme observations',
  'Accounting distortions: ROA sensitive to aggressive accruals and one-time events; winsorization partial mitigation',
  'Sample period: 2010–2020 includes financial crisis aftermath and COVID-19; structural breaks possible',
];

addBulletText(slide, 0.65, 1.35, 8.7, 5.35, limitations, 10);

// ===== SLIDE 13: CONCLUSIONS & RECOMMENDATIONS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Summary');
addSlideTitle(slide, 'Key Conclusions and Next Steps');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.07);

slide.addText('Summary of Findings:', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const summaryPoints = [
  'M1–M3 project successfully merged lobbying and financial data for 5,099 firm-year observations',
  'M2 EDA identified moderate positive correlation; M3 regression yields negative but imprecise estimates',
  'Heterogeneity substantial; effects differ by firm size and persist across robustness checks but with sign/magnitude instability',
  'Evidence supports pattern-consistent associations, not definitive causal effects of lobbying on profitability',
];

addBulletText(slide, 0.8, 1.7, 8.4, 1.8, summaryPoints, 10.5);

slide.addText('Recommendations for Future Research:', {
  x: 0.65,
  y: 3.65,
  w: 8.7,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const futurePoints = [
  'Leverage natural experiments or regulatory shocks for stronger identification',
  'Expand industry classification to control for sector-level policy exposure',
  'Investigate firm-specific channels: M&A activity, regulatory compliance, patent filings',
  'Model lobbying endogeneity explicitly using instrumental variables or dynamic specifications',
  'Extend sample period and include alternative profitability measures (ROE, Tobin\'s Q, market returns)',
];

addBulletText(slide, 0.8, 4, 8.4, 2.5, futurePoints, 10);

// Generate PDF
const outputPath = path.join(__dirname, '..', 'results', 'reports', 'Capstone_Research_Presentation.pptx');
prs.writeFile({ fileName: outputPath });
console.log(`✓ Comprehensive capstone presentation created: ${outputPath}`);
