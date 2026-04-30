#!/usr/bin/env node
/**
 * Generate Comprehensive Capstone Research Presentation (Enhanced Design)
 * Covers M1 (Data), M2 (EDA), and M3 (Results) with modern navy/light blue design
 * All content preserved; visual design significantly enhanced
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Initialize presentation
const prs = new PptxGenJS();
prs.defineLayout({ name: 'LAYOUT_WIDE', width: 10, height: 7.5 });
prs.layout = 'LAYOUT_WIDE';

// Enhanced color scheme with navy and light blue
const colors = {
  navy: '102A43',
  darkNavy: '061621',
  lightBlue: 'DCEEFF',
  skyBlue: 'E8F2FF',
  accentBlue: '0066CC',
  brightBlue: '1E88E5',
  white: 'FFFFFF',
  darkText: '24364B',
  mediumText: '5F7084',
  lightText: '7A8DA0',
  background: 'F5F8FB',
  gold: 'D4AF37',
  warning: 'FFF3CD',
  warningBorder: 'FFD700',
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
    w: 1.1,
    h: 0.28,
    rectRadius: 0.06,
    fill: { color: colors.accentBlue },
    line: { color: colors.accentBlue, pt: 0 },
  });
  slide.addText(text, {
    x: 0.35,
    y: 0.22,
    w: 1.1,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 8,
    bold: true,
    color: colors.white,
    align: 'center',
    margin: 0,
  });
}

function addSlideTitle(slide, title) {
  // Add accent line
  slide.addShape(prs.ShapeType.rect, {
    x: 0.35,
    y: 0.53,
    w: 0.06,
    h: 0.5,
    fill: { color: colors.accentBlue },
    line: { type: 'none' },
  });

  slide.addText(title, {
    x: 0.5,
    y: 0.6,
    w: 9.15,
    h: 0.4,
    fontFace: 'Trebuchet MS',
    fontSize: 28,
    bold: true,
    color: colors.navy,
    align: 'left',
    margin: 0,
  });
}

function addCard(slide, x, y, w, h, bgColor = colors.white, borderColor = colors.lightBlue, borderPt = 0.05) {
  slide.addShape(prs.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.12,
    fill: { color: bgColor },
    line: { color: borderColor, pt: borderPt },
    shadow: {
      type: 'outer',
      angle: 45,
      blur: 4,
      color: '000000',
      opacity: 0.12,
      offset: 2,
    },
  });
}

function addCardTitle(slide, x, y, w, text) {
  slide.addText(text, {
    x,
    y,
    w,
    h: 0.28,
    fontFace: 'Trebuchet MS',
    fontSize: 12,
    bold: true,
    color: colors.navy,
    align: 'left',
  });
}

function addBulletText(slide, x, y, w, h, bullets, fontSize = 10.5) {
  const bulletTexts = bullets.map(b => `• ${b}`).join('\n');
  slide.addText(bulletTexts, {
    x, y, w, h,
    fontFace: 'Aptos',
    fontSize,
    color: colors.darkText,
    align: 'left',
    valign: 'top',
    margin: [0.1, 0.15, 0.1, 0.15],
    lineSpacing: 16,
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
    color: colors.lightText,
    align: 'center',
    margin: 0,
  });
}

// ===== SLIDE 1: TITLE SLIDE =====
let slide = addSlide();
addBackground(slide);

// Decorative header with navy
slide.addShape(prs.ShapeType.rect, {
  x: 0,
  y: 0,
  w: 10,
  h: 1.8,
  fill: { color: colors.navy },
  line: { type: 'none' },
});

// Accent stripe
slide.addShape(prs.ShapeType.rect, {
  x: 0,
  y: 1.8,
  w: 10,
  h: 0.1,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

slide.addText('Corporate Lobbying and Firm Profitability', {
  x: 0.35,
  y: 2.6,
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
  y: 3.35,
  w: 9.3,
  h: 0.35,
  fontFace: 'Aptos',
  fontSize: 16,
  color: colors.accentBlue,
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

// Main content card
addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.05);

slide.addText('Primary Research Question:', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.28,
  fontFace: 'Trebuchet MS',
  fontSize: 13,
  bold: true,
  color: colors.navy,
});

slide.addText('What is the relationship between firms\' lobbying expenditures and their subsequent profitability?', {
  x: 0.65,
  y: 1.68,
  w: 8.7,
  h: 0.45,
  fontFace: 'Aptos',
  fontSize: 11,
  italic: true,
  color: colors.accentBlue,
});

slide.addText('Key Objectives:', {
  x: 0.65,
  y: 2.25,
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

addBulletText(slide, 0.8, 2.55, 8.4, 3.9, objectives, 10.5);

// ===== SLIDE 3: DATA SOURCES AND INTEGRATION =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Milestone 1');
addSlideTitle(slide, 'Data Sources and Integration');

// Left card - Lobbying Data
addCard(slide, 0.35, 1.15, 4.4, 5.5, colors.white, colors.lightBlue, 0.05);

// Header with accent
slide.addShape(prs.ShapeType.rect, {
  x: 0.35,
  y: 1.15,
  w: 0.05,
  h: 5.5,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

addCardTitle(slide, 0.6, 1.32, 4, 'Lobbying Data');

const lobbyingPoints = [
  'Source: Senate Lobbying Disclosure Reports (LobbyView)',
  'Unit: Firm-year observations',
  'Period: 2010–2020',
  'Key variable: Annual total lobbying expenditure (USD)',
  'Coverage: 1,534 unique firms',
];

addBulletText(slide, 0.6, 1.65, 4, 4.8, lobbyingPoints, 9);

// Right card - Financial Data
addCard(slide, 5.25, 1.15, 4.4, 5.5, colors.white, colors.lightBlue, 0.05);

// Header with accent
slide.addShape(prs.ShapeType.rect, {
  x: 5.25,
  y: 1.15,
  w: 0.05,
  h: 5.5,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

addCardTitle(slide, 5.5, 1.32, 4, 'Financial Data');

const financialPoints = [
  'Source: SEC XBRL filings (10-K annual reports)',
  'Unit: Firm-year observations',
  'Period: 2010–2020',
  'Key variables: Total Assets, Net Income, Revenues',
  'Coverage: 1,375 unique firms',
];

addBulletText(slide, 5.5, 1.65, 4, 4.8, financialPoints, 9);

// Summary box at bottom
slide.addShape(prs.ShapeType.roundRect, {
  x: 0.35,
  y: 6.75,
  w: 9.3,
  h: 0.68,
  fill: { color: colors.skyBlue },
  line: { color: colors.accentBlue, pt: 0.03 },
  rectRadius: 0.1,
});

slide.addText('After merge: 5,099 firm-year observations across 1,375 firms; balanced panel yielded 836 observations (66 firms with complete 2010–2020 data)', {
  x: 0.5,
  y: 6.8,
  w: 9,
  h: 0.58,
  fontFace: 'Aptos',
  fontSize: 9.5,
  color: colors.navy,
  align: 'center',
  valign: 'middle',
  bold: true,
});

// ===== SLIDE 4: M2 EDA - DESCRIPTIVE STATISTICS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Milestone 2');
addSlideTitle(slide, 'Exploratory Data Analysis: Key Patterns');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.05);

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

addBulletText(slide, 0.8, 1.7, 8.4, 4.8, edaPoints, 10);

addFooter(slide, 'M2 Hypothesis Development: Positive effect expected, strongest at lag 1–2, larger for big firms');

// ===== SLIDE 5: DATA QUALITY & SAMPLE OVERVIEW =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Data Quality');
addSlideTitle(slide, 'Sample Characteristics and Coverage');

// Table
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
  colW: [2.5, 1.5, 2.2, 2.6],
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

addBulletText(slide, 0.35, 3.85, 9.3, 2.9, qualityNotes, 9.5);

// ===== SLIDE 6: M3 MAIN RESULTS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Milestone 3');
addSlideTitle(slide, 'Main Econometric Results');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.05);

slide.addText('Two-Way Fixed Effects Panel Regression (Firm and Year FE, Clustered SEs)', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.28,
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

addBulletText(slide, 0.8, 1.75, 8.4, 3.8, mainResults, 10);

// Key finding box
slide.addShape(prs.ShapeType.roundRect, {
  x: 0.65,
  y: 5.65,
  w: 8.4,
  h: 1,
  rectRadius: 0.1,
  fill: { color: colors.warning },
  line: { color: colors.warningBorder, pt: 0.06 },
});

slide.addText('⚠ Key Finding: Evidence for negative association is weaker than EDA\'s positive findings, suggesting alternative mechanisms or model sensitivity.', {
  x: 0.8,
  y: 5.75,
  w: 8.1,
  h: 0.8,
  fontFace: 'Aptos',
  fontSize: 9.5,
  color: colors.darkText,
  align: 'left',
  valign: 'middle',
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
  fontSize: 8.5,
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

addBulletText(slide, 0.35, 5.25, 9.3, 1.65, interpPoints, 9);

// ===== SLIDE 8: FIRM SIZE HETEROGENEITY =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Heterogeneity');
addSlideTitle(slide, 'Differential Effects by Firm Size');

// Left card
addCard(slide, 0.35, 1.15, 4.4, 5.5, colors.white, colors.lightBlue, 0.05);

slide.addShape(prs.ShapeType.rect, {
  x: 0.35,
  y: 1.15,
  w: 0.05,
  h: 5.5,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

addCardTitle(slide, 0.6, 1.32, 4, 'Large Firms');

const largePoints = [
  'Coefficient: β = –24.09 (SE = 5.25, p < 0.001)',
  'Precisely estimated; statistically significant',
  'Small magnitude but consistent',
  'Interpretation: Defensive lobbying by larger, more exposed firms',
];

addBulletText(slide, 0.6, 1.65, 4, 4.8, largePoints, 9);

// Right card
addCard(slide, 5.25, 1.15, 4.4, 5.5, colors.white, colors.lightBlue, 0.05);

slide.addShape(prs.ShapeType.rect, {
  x: 5.25,
  y: 1.15,
  w: 0.05,
  h: 5.5,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

addCardTitle(slide, 5.5, 1.32, 4, 'Small Firms');

const smallPoints = [
  'Coefficient: β = –5,753.85 (SE = 4,059.05, p = 0.156)',
  'Very large magnitude but imprecise',
  'Not statistically significant',
  'Likely driven by few extreme spenders; high noise in small-firm lobbying',
];

addBulletText(slide, 5.5, 1.65, 4, 4.8, smallPoints, 9);

addFooter(slide, 'Pattern suggests: Larger firms\' lobbying may reflect strategic regulatory engagement; smaller firms show sparse, ad hoc behavior.');

// ===== SLIDE 9: ALTERNATIVE SPECIFICATIONS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Extensions');
addSlideTitle(slide, 'Alternative Specifications and Diagnostics');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.05);

const altSpecs = [
  'Three-way FE with industry-by-year interactions: β = –159.48 (p = 0.367) — sign remains negative, precision similar to baseline',
  'Staggered difference-in-differences (Callaway-Sant\'Anna): Average treatment effect ≈ –338.79 pp; large, negative, but uncertain',
  'Cluster bootstrap 95% CI: [–517.62, 149.65] — wide interval spans positive and negative, confirming low precision',
  'Breusch-Pagan test for heteroskedasticity: p < 0.0001; justifies clustered SEs over homoskedastic OLS',
  'Variance Inflation Factors (VIF) for controls: max 2.74; multicollinearity not a concern',
  'Diagnostic plots (Q-Q, residvals-vs-fitted): suggest non-ideal residual behavior; pattern consistent with sparse, heterogeneous panel',
];

addBulletText(slide, 0.65, 1.35, 8.7, 5.35, altSpecs, 9.5);

// ===== SLIDE 10: ARIMA BENCHMARK =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Benchmark');
addSlideTitle(slide, 'Time-Series Benchmark: ARIMA Model');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.05);

slide.addText('ARIMA(0,1,0) Specification (Random Walk with Differencing):', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.26,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const arimaPoints = [
  'Augmented Dickey-Fuller test: p-value = 0.2287 (non-stationary; differencing applied)',
  'Selected order: (0, 1, 0) based on AIC minimization',
  'Out-of-sample RMSE: 523.53',
  'Naive benchmark RMSE (carry-forward): 523.53',
  'No predictive gain from ARIMA vs. simple extrapolation; aggregate ROA trends not easily forecasted by lags alone',
  '→ Implication: Annual aggregate profitability dynamics driven by factors other than recent own history',
];

addBulletText(slide, 0.8, 1.7, 8.4, 4.8, arimaPoints, 10);

// ===== SLIDE 11: MECHANISMS & INTERPRETATION =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Discussion');
addSlideTitle(slide, 'Mechanisms and Interpretation');

// Left card
addCard(slide, 0.35, 1.15, 4.4, 5.5, colors.white, colors.lightBlue, 0.05);

slide.addShape(prs.ShapeType.rect, {
  x: 0.35,
  y: 1.15,
  w: 0.05,
  h: 5.5,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

addCardTitle(slide, 0.6, 1.32, 4, 'Possible Explanations');

const mechPoints = [
  'Defensive lobbying: Firms spend to prevent worse outcomes',
  'Policy uncertainty: Regulatory exposure drives both lobbying and lower profitability',
  'Selection effect: Worse-performing firms spend more on lobbying',
  'Omitted factors: Industry shocks or managerial quality confound the relationship',
];

addBulletText(slide, 0.6, 1.65, 4, 4.8, mechPoints, 8.5);

// Right card
addCard(slide, 5.25, 1.15, 4.4, 5.5, colors.white, colors.lightBlue, 0.05);

slide.addShape(prs.ShapeType.rect, {
  x: 5.25,
  y: 1.15,
  w: 0.05,
  h: 5.5,
  fill: { color: colors.accentBlue },
  line: { type: 'none' },
});

addCardTitle(slide, 5.5, 1.32, 4, 'Data Interpretation');

const dataInterpPoints = [
  'Evidence not conclusive: Both positive and negative associations possible depending on specification',
  'Firm-level heterogeneity dominates: Large firm effect robust, small firm effect noisy',
  'Temporal instability: Different lags yield different signs; suggests complex dynamics',
  'Strong lead effect: Reverse causality likely; low-performing firms increase spending',
];

addBulletText(slide, 5.5, 1.65, 4, 4.8, dataInterpPoints, 8.5);

// ===== SLIDE 12: LIMITATIONS & RECOMMENDATIONS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Conclusions');
addSlideTitle(slide, 'Limitations and Future Directions');

addCard(slide, 0.35, 1.15, 9.3, 5.75, colors.white, colors.lightBlue, 0.05);

slide.addText('Study Limitations:', {
  x: 0.65,
  y: 1.35,
  w: 8.7,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const limitations = [
  'Sparse lobbying observations: 95%+ missing data in merged panel; selection bias toward large, visible firms',
  'Measurement: ROA (profitability) may not capture long-term firm value or stock returns; accounting-based metric only',
  'Confounding: Many unobserved factors (managerial quality, competition, technology) co-vary with lobbying',
  'Reverse causality: Lead effect suggests weaker-performing firms lobby more; inference difficult without instruments',
];

addBulletText(slide, 0.65, 1.7, 8.7, 2.1, limitations, 10);

slide.addText('Future Research Directions:', {
  x: 0.65,
  y: 3.9,
  w: 8.7,
  h: 0.25,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

const directions = [
  'Acquire lobbying instruments (regulatory exposure indices, policy indices) to isolate causal effects',
  'Extend to stock market measures (returns, Tobin\'s Q) to capture investor perspective on lobbying value',
  'Build dynamic panel models with lagged dependent variables; address Nickell bias carefully',
  'Incorporate issue-level lobbying strategies (defense, offense) to refine mechanistic understanding',
];

addBulletText(slide, 0.65, 4.25, 8.7, 2.45, directions, 10);

// ===== SLIDE 13: SUMMARY & CONCLUSIONS =====
slide = addSlide();
addBackground(slide);
addTopLabel(slide, 'Final');
addSlideTitle(slide, 'Key Takeaways');

// Main summary box
slide.addShape(prs.ShapeType.roundRect, {
  x: 0.35,
  y: 1.15,
  w: 9.3,
  h: 1.3,
  fill: { color: colors.skyBlue },
  line: { color: colors.accentBlue, pt: 0.08 },
  rectRadius: 0.12,
});

slide.addText('Research Question: What is the relationship between corporate lobbying and firm profitability?', {
  x: 0.55,
  y: 1.25,
  w: 8.9,
  h: 0.28,
  fontFace: 'Trebuchet MS',
  fontSize: 12,
  bold: true,
  color: colors.navy,
});

slide.addText('Answer: Evidence is mixed and model-dependent. Panel regressions suggest a negative association (β ≈ –174.59), but the effect is imprecise, driven by reverse causality, and inconsistent across specifications. EDA showed positive correlations in bivariate relationships, but fixed-effects models reveal complexity and firm-size heterogeneity.', {
  x: 0.55,
  y: 1.55,
  w: 8.9,
  h: 0.75,
  fontFace: 'Aptos',
  fontSize: 10,
  color: colors.darkText,
  valign: 'top',
});

// Three-column summary
slide.addText('M1: Data Integration', {
  x: 0.35,
  y: 2.6,
  w: 2.8,
  h: 0.22,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.accentBlue,
  align: 'center',
});

const m1Summary = [
  '5,099 firm-year obs.',
  '1,375 unique firms',
  '2010–2020 period',
  '836 balanced panel',
];

addBulletText(slide, 0.35, 2.85, 2.8, 2.2, m1Summary, 8.5);

slide.addText('M2: EDA Insights', {
  x: 3.6,
  y: 2.6,
  w: 2.8,
  h: 0.22,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.accentBlue,
  align: 'center',
});

const m2Summary = [
  'Positive correlations',
  'Lag 1–2 strongest',
  'Size heterogeneity',
  'Sparse outliers',
];

addBulletText(slide, 3.6, 2.85, 2.8, 2.2, m2Summary, 8.5);

slide.addText('M3: Regression Results', {
  x: 6.85,
  y: 2.6,
  w: 2.8,
  h: 0.22,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.accentBlue,
  align: 'center',
});

const m3Summary = [
  'β = –174.59 (p=0.135)',
  'Not sig. at α=0.05',
  'Reverse causality',
  'Model sensitive',
];

addBulletText(slide, 6.85, 2.85, 2.8, 2.2, m3Summary, 8.5);

// Final insight boxes
addCard(slide, 0.35, 5.2, 9.3, 2.1, colors.warning, colors.warningBorder, 0.06);

slide.addText('Conclusion:', {
  x: 0.55,
  y: 5.35,
  w: 8.9,
  h: 0.22,
  fontFace: 'Trebuchet MS',
  fontSize: 11,
  bold: true,
  color: colors.darkText,
});

slide.addText('The causal relationship between corporate lobbying and firm profitability remains unclear. Empirical evidence leans toward a negative association in fixed-effects models, but this finding is imprecise and likely confounded by reverse causality. Strategic lobbying may be a sign of defensive positioning by firms facing headwinds rather than a driver of superior returns. Strong firm-size heterogeneity suggests differentiated mechanisms: large, visible firms engage in routine regulatory management; small firms show sporadic, ad-hoc behavior. Future research should employ causal instruments and longer time-series to resolve these ambiguities.', {
  x: 0.55,
  y: 5.6,
  w: 8.9,
  h: 1.6,
  fontFace: 'Aptos',
  fontSize: 9,
  color: colors.darkText,
  valign: 'top',
  align: 'left',
});

// Write presentation to file
const outputPath = path.join(__dirname, '..', 'results', 'reports', 'Capstone_Research_Presentation.pptx');
prs.writeFile(outputPath);
console.log(`✓ Enhanced presentation created: ${outputPath}`);
