const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();

pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'GitHub Copilot';
pptx.company = 'QM 2023 Capstone';
pptx.subject = 'Lobbying and profitability presentation';
pptx.title = 'Lobbying and Profitability';
pptx.lang = 'en-US';

const C = {
  navy: '102A43',
  blue: '58A6FF',
  lightBlue: 'DCEEFF',
  ice: 'F3F8FD',
  white: 'FFFFFF',
  text: '24364B',
  muted: '5F7084',
  border: 'C9D8E8',
  softBorder: 'DDE8F2',
  pale2: 'E7F1FB',
};

const outFile = path.resolve(__dirname, '..', 'results', 'reports', 'M3_investor_presentation.pptx');
const figDir = path.resolve(__dirname, '..', 'results', 'figures');

function stars(p) {
  if (p < 0.01) return '***';
  if (p < 0.05) return '**';
  if (p < 0.1) return '*';
  return '';
}

function addBackground(slide, color = C.ice) {
  slide.background = { color };
}

function addTopLabel(slide, label, x = 0.55, y = 0.32) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: 1.55,
    h: 0.34,
    rectRadius: 0.08,
    fill: { color: C.lightBlue },
    line: { color: C.lightBlue, pt: 1 },
  });
  slide.addText(label.toUpperCase(), {
    x,
    y: y + 0.03,
    w: 1.55,
    h: 0.22,
    fontFace: 'Trebuchet MS',
    fontSize: 9,
    bold: true,
    color: C.navy,
    align: 'center',
    valign: 'mid',
    margin: 0,
    charSpacing: 1.1,
  });
}

function addSlideTitle(slide, title, subtitle = '') {
  slide.addText(title, {
    x: 0.55,
    y: 0.72,
    w: 8.7,
    h: subtitle ? 0.46 : 0.38,
    fontFace: 'Trebuchet MS',
    fontSize: 24,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.55,
      y: 1.12,
      w: 8.9,
      h: 0.34,
      fontFace: 'Aptos',
      fontSize: 10.5,
      color: C.muted,
      margin: 0,
      fit: 'shrink',
    });
  }
}

function addCard(slide, x, y, w, h, fill = C.white, line = C.border, shadowOpacity = 0.08) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.09,
    fill: { color: fill },
    line: { color: line, pt: 1 },
    shadow: { type: 'outer', color: '000000', blur: 3, offset: 1.5, angle: 45, opacity: shadowOpacity },
  });
}

function addMetricCard(slide, x, y, w, h, label, value, detail, fill = C.white, accent = C.blue) {
  addCard(slide, x, y, w, h, fill, C.softBorder, 0.08);
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w: 0.12,
    h,
    fill: { color: accent },
    line: { color: accent, pt: 0 },
  });
  slide.addText(label, {
    x: x + 0.22,
    y: y + 0.12,
    w: w - 0.32,
    h: 0.18,
    fontFace: 'Aptos',
    fontSize: 9,
    bold: true,
    color: C.muted,
    margin: 0,
  });
  slide.addText(value, {
    x: x + 0.22,
    y: y + 0.30,
    w: w - 0.32,
    h: 0.36,
    fontFace: 'Trebuchet MS',
    fontSize: 21,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText(detail, {
    x: x + 0.22,
    y: y + 0.69,
    w: w - 0.32,
    h: h - 0.76,
    fontFace: 'Aptos',
    fontSize: 9.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
}

function addImageCard(slide, imagePath, x, y, w, h, caption, caption2 = '') {
  addCard(slide, x, y, w, h, C.white, C.softBorder, 0.08);
  slide.addImage({
    path: imagePath,
    x: x + 0.12,
    y: y + 0.12,
    w: w - 0.24,
    h: h - 0.62,
    sizing: { type: 'contain', w: w - 0.24, h: h - 0.62 },
  });
  slide.addText(caption, {
    x: x + 0.14,
    y: y + h - 0.42,
    w: w - 0.28,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 9,
    italic: true,
    color: C.muted,
    margin: 0,
    fit: 'shrink',
  });
  if (caption2) {
    slide.addText(caption2, {
      x: x + 0.14,
      y: y + h - 0.24,
      w: w - 0.28,
      h: 0.16,
      fontFace: 'Aptos',
      fontSize: 8.5,
      color: C.muted,
      margin: 0,
      fit: 'shrink',
    });
  }
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.55,
    y: 7.12,
    w: 8.9,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 8,
    color: C.muted,
    margin: 0,
  });
}

function notes(lines) {
  return lines.join('\n');
}

function buildTitleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: 8.2,
    y: -0.8,
    w: 3.5,
    h: 3.5,
    fill: { color: C.blue, transparency: 70 },
    line: { color: C.blue, transparency: 100, pt: 0 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 9.05,
    y: 3.95,
    w: 2.1,
    h: 2.1,
    fill: { color: C.lightBlue, transparency: 76 },
    line: { color: C.lightBlue, transparency: 100, pt: 0 },
  });

  slide.addText('Lobbying and\nProfitability', {
    x: 0.72,
    y: 1.0,
    w: 4.6,
    h: 1.35,
    fontFace: 'Trebuchet MS',
    fontSize: 31,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('A simple, investor-facing readout of how firm lobbying spend lines up with future ROA in the merged 2010-2020 panel.', {
    x: 0.74,
    y: 2.45,
    w: 4.9,
    h: 0.55,
    fontFace: 'Aptos',
    fontSize: 13,
    color: 'D7E6F7',
    margin: 0,
    fit: 'shrink',
  });

  addMetricCard(slide, 6.1, 1.0, 3.05, 1.0, 'Headline result', '-174.6 pp', 'A $1M increase in lagged lobbying spend is associated with lower ROA, but the estimate is noisy.', C.white, C.blue);
  addMetricCard(slide, 6.1, 2.15, 3.05, 1.0, 'Model sample', '2,125 rows', 'Firm-years after lagging spend and dropping missing controls.', C.white, C.lightBlue);
  addMetricCard(slide, 6.1, 3.30, 3.05, 1.0, 'Panel scope', '1,375 firms', 'Merged financial and lobbying panel covering 2010-2020.', C.white, C.lightBlue);
  addMetricCard(slide, 6.1, 4.45, 3.05, 1.0, 'Robustness', 'Negative sign', 'The sign stays mostly negative across lag, DiD, and bootstrap checks.', C.white, C.lightBlue);

  slide.addText('Prepared from the project’s cleaned panel, regression tables, and diagnostic figures.', {
    x: 0.74,
    y: 6.62,
    w: 5.4,
    h: 0.18,
    fontFace: 'Aptos',
    fontSize: 9,
    color: 'D7E6F7',
    margin: 0,
  });

  slide.addNotes(notes([
    'Open with the main takeaway: lobbying does not show a clear payoff in future profitability, and the point estimate is negative.',
    'Emphasize that this is a merged firm-year panel from 2010 to 2020, so the analysis is about repeated firm observations over time rather than one cross-section snapshot.',
    'Keep the tone careful: the estimate is informative as a pattern, not a definitive causal claim.',
  ]));
}

function buildExecutiveSummarySlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Executive Summary');
  addSlideTitle(slide, 'What the data say in plain English', 'The key question is whether more lobbying is followed by better profits.');

  addCard(slide, 0.55, 1.55, 6.3, 4.4, C.white, C.softBorder, 0.07);
  slide.addText('The main fixed-effects model points to a negative relationship: a $1 million increase in lobbying spend next year lines up with about a 174.6 percentage-point drop in ROA. That estimate is not statistically strong, so it should be read as a pattern, not proof.', {
    x: 0.82,
    y: 1.88,
    w: 5.72,
    h: 1.15,
    fontFace: 'Aptos',
    fontSize: 16,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('The same negative direction shows up in several checks, but the lead test warns that profitability may sometimes move before lobbying does. That makes the result useful for screening, not for treating lobbying as a reliable profit engine.', {
    x: 0.82,
    y: 3.15,
    w: 5.72,
    h: 1.0,
    fontFace: 'Aptos',
    fontSize: 14,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addMetricCard(slide, 7.05, 1.55, 2.15, 1.02, 'Lag used', '1 year', 'Lobbying is measured one year before ROA to reduce same-year reverse causality.', C.white, C.blue);
  addMetricCard(slide, 7.05, 2.72, 2.15, 1.02, 'p-value', '0.135', 'The clustered estimate is not conventionally significant.', C.white, C.lightBlue);
  addMetricCard(slide, 7.05, 3.89, 2.15, 1.02, 'Balanced panel', '66 firms', 'A tighter sample is available for robustness checks.', C.white, C.lightBlue);
  addCard(slide, 0.55, 5.95, 8.65, 0.78, C.pale2, C.lightBlue, 0.0);
  slide.addText('Recommendation: do not overweight lobbying alone as a sign of future profitability. If you need a portfolio tilt, favor firms with steadier earnings and lower policy dependence, and stay cautious with heavy lobbyers until the relationship is clearer.', {
    x: 0.82,
    y: 6.15,
    w: 8.08,
    h: 0.34,
    fontFace: 'Aptos',
    fontSize: 12.5,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Executive summary based on results in results/tables/M3_regression_table.txt, results/reports/M3_interpretation.md, and robustness checks.');
  slide.addNotes(notes([
    'State the main finding first: the point estimate is negative, but the standard error is large enough that it is not a clean signal.',
    'Translate the magnitude carefully. The number is large because ROA is a ratio, so the practical message is about direction and uncertainty, not exact dollar-for-dollar forecasting.',
    'Close with the recommendation: treat lobbying as a weak screening variable, not a basis for a strong overweight call by itself.',
  ]));
}

function buildMethodologySlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Methodology');
  addSlideTitle(slide, 'How the panel was built and estimated', 'The setup is simple: clean the data, merge the firm-year records, then compare each firm to itself over time.');

  addCard(slide, 0.55, 1.5, 4.15, 4.95, C.white, C.softBorder, 0.07);
  slide.addText('Data sources', {
    x: 0.82,
    y: 1.78,
    w: 3.4,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('1. SEC XBRL 10-K filings provide assets, income, and revenue.\n2. Senate Lobbying Disclosure Reports provide yearly lobbying spend.\n3. A CIK-GVKEY crosswalk links the two sources into one firm-year panel.', {
    x: 0.82,
    y: 2.15,
    w: 3.45,
    h: 1.35,
    fontFace: 'Aptos',
    fontSize: 12.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('Sample construction', {
    x: 0.82,
    y: 3.72,
    w: 3.4,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Merged panel: 5,099 firm-years from 1,375 firms.\nMain FE model: 2,125 firm-years after lagging lobbying spend and dropping missing controls.\nBalanced robustness sample: 836 firm-years from 66 firms.', {
    x: 0.82,
    y: 4.08,
    w: 3.45,
    h: 1.55,
    fontFace: 'Aptos',
    fontSize: 11.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 4.95, 1.5, 4.25, 4.95, C.white, C.softBorder, 0.07);
  slide.addText('Model equation', {
    x: 5.22,
    y: 1.78,
    w: 3.5,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('ROA_it = β1 Lobbying_spend_i,t-1 + β2 log(Assets_it) + β3 log(Revenues_it) + firm FE + year FE + error_it', {
    x: 5.22,
    y: 2.12,
    w: 3.7,
    h: 0.85,
    fontFace: 'Aptos',
    fontSize: 13,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('Variable meanings', {
    x: 5.22,
    y: 3.12,
    w: 3.5,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('ROA = net income divided by assets.\nLobbying spend = annual lobbying dollars, shifted one year earlier.\nAssets and revenues are logged to keep the scale stable and to reduce skew.', {
    x: 5.22,
    y: 3.46,
    w: 3.55,
    h: 1.2,
    fontFace: 'Aptos',
    fontSize: 11.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('Inference', {
    x: 5.22,
    y: 4.95,
    w: 3.5,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Standard errors are clustered at the firm level so the uncertainty reflects repeated observations within the same entity.', {
    x: 5.22,
    y: 5.28,
    w: 3.5,
    h: 0.55,
    fontFace: 'Aptos',
    fontSize: 11.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Sources: data/processed/financials_clean.csv, data/processed/lobbying_clean.csv, data/processed/cik_gvkey_crosswalk.csv, data/final/merged_financials_lobbying.csv.');
  slide.addNotes(notes([
    'Walk through the data pipeline in order: financials, lobbying, crosswalk, then merged panel.',
    'Explain that lagging lobbying spend is the main design choice to reduce the obvious same-year reverse causality concern.',
    'Point out that the clustered standard errors are not a decoration; the diagnostics show heteroskedasticity, so clustered inference is the right default.',
  ]));
}

function buildMainResultsSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Results');
  addSlideTitle(slide, 'Table 1. Main fixed-effects regression', 'The coefficient is negative, but the uncertainty is large enough that the estimate is not conventionally significant.');

  addCard(slide, 0.55, 1.5, 8.85, 4.95, C.white, C.softBorder, 0.07);
  const rows = [
    [
      { text: 'Variable', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Coef.', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'SE', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 't', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'p', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Stars', options: { bold: true, color: C.white, fill: { color: C.navy } } },
    ],
    [
      { text: 'Lobbying spend, t-1 ($M)' },
      { text: '-174.587' },
      { text: '116.934' },
      { text: '-1.49' },
      { text: '0.135' },
      { text: stars(0.135) },
    ],
    [
      { text: 'Log(Assets)' },
      { text: '234.706' },
      { text: '148.659' },
      { text: '1.58' },
      { text: '0.114' },
      { text: stars(0.114) },
    ],
    [
      { text: 'Log(Revenues)' },
      { text: '47.835' },
      { text: '43.565' },
      { text: '1.10' },
      { text: '0.276' },
      { text: stars(0.276) },
    ],
  ];

  slide.addTable(rows, {
    x: 0.82,
    y: 1.82,
    w: 8.32,
    h: 2.15,
    colW: [2.85, 1.1, 1.0, 0.85, 0.85, 0.7],
    rowH: [0.38, 0.52, 0.52, 0.52],
    border: { type: 'solid', color: C.border, pt: 1 },
    fill: C.white,
    margin: 0.06,
    fontFace: 'Aptos',
    fontSize: 10,
    color: C.text,
    valign: 'mid',
    bold: false,
    align: 'center',
    autoFit: false,
    shape: pptx.ShapeType.rect,
    headerRow: true,
    headerCol: false,
    bandRow: true,
    firstRow: false,
  });

  slide.addText('Key readout: the sign is negative, but the estimate is not tight enough to support a strong investment claim on its own.', {
    x: 0.82,
    y: 4.25,
    w: 8.2,
    h: 0.34,
    fontFace: 'Aptos',
    fontSize: 12.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  addMetricCard(slide, 0.82, 4.78, 2.4, 0.95, 'Entity FE', 'Yes', 'Each firm is compared with itself over time.', C.ice, C.blue);
  addMetricCard(slide, 3.40, 4.78, 2.4, 0.95, 'Time FE', 'Yes', 'Common year shocks are absorbed.', C.ice, C.lightBlue);
  addMetricCard(slide, 5.98, 4.78, 2.4, 0.95, 'Observations', '2,125', 'Firm-years used in the main specification.', C.ice, C.lightBlue);

  addFooter(slide, 'Table 1 uses clustered standard errors at the firm level. Significance stars follow the usual cutoffs: * p<0.10, ** p<0.05, *** p<0.01.');
  slide.addNotes(notes([
    'Make the interpretation simple: the coefficient is negative, but the p-value says the effect is not sharp enough to treat as a strong result.',
    'Mention that the model already includes firm and year fixed effects, so the estimate is based on within-firm movement over time.',
    'If asked about the magnitude, remind the audience that ROA is a ratio and the sample is sparse, so the safer interpretation is direction plus uncertainty.',
  ]));
}

function buildAlternativeAndFigureSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Results');
  addSlideTitle(slide, 'Table 2. Alternative specs and Figure 1', 'The sign mostly stays negative, but the size and precision shift when the timing or identification strategy changes.');

  addCard(slide, 0.55, 1.52, 4.1, 4.95, C.white, C.softBorder, 0.07);
  const altRows = [
    [
      { text: 'Model', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Headline result', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Takeaway', options: { bold: true, color: C.white, fill: { color: C.navy } } },
    ],
    [
      { text: 'Three-way FE' },
      { text: '-159.5' },
      { text: 'Same direction; still noisy.' },
    ],
    [
      { text: 'Lead-1 placebo' },
      { text: '-302.7*' },
      { text: 'Warning sign for reverse timing.' },
    ],
    [
      { text: 'Staggered DiD' },
      { text: 'ATT ≈ -338.8' },
      { text: 'Negative on average; limited support.' },
    ],
    [
      { text: 'ARIMA benchmark' },
      { text: 'RMSE 523.5' },
      { text: 'No gain over the naive forecast.' },
    ],
    [
      { text: 'Cluster bootstrap' },
      { text: '95% CI [-517.6, 149.7]' },
      { text: 'Interval still crosses zero.' },
    ],
  ];
  slide.addTable(altRows, {
    x: 0.78,
    y: 1.84,
    w: 3.6,
    h: 4.12,
    colW: [1.03, 1.0, 1.57],
    rowH: [0.38, 0.52, 0.52, 0.52, 0.52, 0.52],
    border: { type: 'solid', color: C.border, pt: 1 },
    fill: C.white,
    margin: 0.05,
    fontFace: 'Aptos',
    fontSize: 8.8,
    color: C.text,
    valign: 'mid',
    align: 'center',
    headerRow: true,
    bandRow: true,
    shape: pptx.ShapeType.rect,
  });
  const fig1 = path.join(figDir, 'M2', 'plot3_dual_axis_outcome_driver.png');
  if (fs.existsSync(fig1)) {
    addImageCard(slide, fig1, 4.95, 1.52, 4.25, 4.95, 'Figure 1. Dual-axis outcome vs. driver', '../figures/M2/plot3_dual_axis_outcome_driver.png');
  } else {
    addCard(slide, 4.95, 1.52, 4.25, 4.95, C.white, C.softBorder, 0.07);
    slide.addText('Figure 1 placeholder', { x: 5.25, y: 3.65, w: 3.6, h: 0.3, fontFace: 'Aptos', fontSize: 16, color: C.muted, align: 'center', margin: 0 });
  }

  addFooter(slide, 'Figure 1 source path when the deck lives in results/reports/: ../figures/M2/plot3_dual_axis_outcome_driver.png.');
  slide.addNotes(notes([
    'Use this slide to show that the result is not a one-model story: alternative specifications tend to keep the same sign, but not the same certainty.',
    'Call out the placebo lead explicitly because it is the clearest caution against a simple causal story.',
    'For the ARIMA benchmark, the key message is that the annual series does not forecast better than a naive baseline, so the time-series angle does not create a tradeable edge.',
  ]));
}

function buildDiagnosticsSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Diagnostics');
  addSlideTitle(slide, 'Figure 2. Diagnostic plots', 'The residual checks do not look perfect, which is exactly why the clustered inference matters.');

  const resid = path.join(figDir, 'M3_residuals_vs_fitted.png');
  const qq = path.join(figDir, 'M3_qq_plot.png');
  addImageCard(slide, resid, 0.55, 1.55, 4.15, 3.15, 'Figure 2A. Residuals vs. fitted', '../figures/M3_residuals_vs_fitted.png');
  addImageCard(slide, qq, 4.95, 1.55, 4.15, 3.15, 'Figure 2B. Q-Q plot', '../figures/M3_qq_plot.png');

  addCard(slide, 0.55, 4.95, 8.55, 1.35, C.pale2, C.lightBlue, 0.0);
  slide.addText('Breusch-Pagan p = 0.0000, so constant-variance errors are not a good assumption. The max VIF is 2.74, which is comfortably below the usual multicollinearity warning zone.', {
    x: 0.82,
    y: 5.25,
    w: 8.0,
    h: 0.4,
    fontFace: 'Aptos',
    fontSize: 12,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('Bottom line: the data are noisy and uneven, but not so collinear that the main coefficient is being mechanically distorted.', {
    x: 0.82,
    y: 5.72,
    w: 8.0,
    h: 0.22,
    fontFace: 'Aptos',
    fontSize: 10.5,
    italic: true,
    color: C.muted,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Diagnostics summarized from results/reports/M3_diagnostics_summary.txt and results/tables/M3_vif_results.csv.');
  slide.addNotes(notes([
    'Interpret the diagnostics as support for the modeling choices, not as decorative appendices.',
    'The heteroskedasticity result is the main reason the clustered standard errors are used throughout the presentation.',
    'The residual plots are a reminder that this is an empirical panel with uneven coverage and skewed firm outcomes, so the goal is robust patterns rather than perfect fit.',
  ]));
}

function buildConclusionsSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: -0.6,
    y: -0.7,
    w: 2.3,
    h: 2.3,
    fill: { color: C.blue, transparency: 72 },
    line: { color: C.blue, transparency: 100, pt: 0 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 8.7,
    y: 5.05,
    w: 2.2,
    h: 2.2,
    fill: { color: C.lightBlue, transparency: 78 },
    line: { color: C.lightBlue, transparency: 100, pt: 0 },
  });

  slide.addText('Conclusions &\nRecommendations', {
    x: 0.72,
    y: 0.88,
    w: 4.9,
    h: 1.1,
    fontFace: 'Trebuchet MS',
    fontSize: 30,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('The most honest reading is that lobbying is a noisy signal, not a dependable profit lever.', {
    x: 0.74,
    y: 2.12,
    w: 4.7,
    h: 0.42,
    fontFace: 'Aptos',
    fontSize: 13,
    color: 'D7E6F7',
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.95, 0.85, 3.75, 2.2, C.white, C.softBorder, 0.08);
  slide.addText('Investment implications', {
    x: 6.2,
    y: 1.1,
    w: 3.2,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Favor firms with steadier earnings and lower policy dependence. If you need a portfolio tilt, underweight heavy lobbyers only as a cautious screen, not as a standalone trade.', {
    x: 6.2,
    y: 1.45,
    w: 3.25,
    h: 1.1,
    fontFace: 'Aptos',
    fontSize: 11.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.95, 3.3, 3.75, 2.0, C.white, C.softBorder, 0.08);
  slide.addText('Risk assessment', {
    x: 6.2,
    y: 3.55,
    w: 3.0,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Main risks: reverse causality, omitted firm strategy, sparse lobbying coverage, and the usual fixed-effects assumptions. The sector signal is also weaker than a full classification-based study would allow.', {
    x: 6.2,
    y: 3.88,
    w: 3.25,
    h: 1.05,
    fontFace: 'Aptos',
    fontSize: 11.4,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.95, 5.55, 3.75, 0.95, C.pale2, C.lightBlue, 0.0);
  slide.addText('Scenario view: if the lagged negative pattern is real, it should show up after a delay. If reverse causality dominates, the signal should weaken quickly.', {
    x: 6.18,
    y: 5.78,
    w: 3.25,
    h: 0.35,
    fontFace: 'Aptos',
    fontSize: 10.5,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Bottom line: do not pay up for lobbying as if it were a proven profitability engine.', {
    x: 0.74,
    y: 5.95,
    w: 4.6,
    h: 0.28,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'Finish with the direct takeaway: the evidence does not justify a strong positive story about lobbying and future profits.',
    'Be explicit that the recommendation is cautious and conditional. The data support a screening rule more than a hard allocation rule.',
    'If the audience asks for the next step, suggest richer sector classification, longer panels, or stronger identification to separate cause from timing.',
  ]));
}

buildTitleSlide();
buildExecutiveSummarySlide();
buildMethodologySlide();
buildMainResultsSlide();
buildAlternativeAndFigureSlide();
buildDiagnosticsSlide();
buildConclusionsSlide();

fs.mkdirSync(path.dirname(outFile), { recursive: true });

pptx.writeFile({ fileName: outFile });
