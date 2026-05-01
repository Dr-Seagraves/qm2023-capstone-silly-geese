#!/usr/bin/env node

/**
 * Generate a professional, navy-forward capstone deck with speaker notes.
 * Target runtime: around 10 minutes.
 */

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'QM 2023 Capstone Team';
pptx.company = 'QM 2023';
pptx.subject = 'Capstone memo presentation';
pptx.title = 'Corporate Lobbying and Firm Profitability';
pptx.lang = 'en-US';

const C = {
  navy: '102A43',
  navyDark: '0A1F33',
  blue: '58A6FF',
  lightBlue: 'DCEEFF',
  ice: 'F3F8FD',
  white: 'FFFFFF',
  text: '24364B',
  muted: '5F7084',
  border: 'C9D8E8',
  softBorder: 'DDE8F2',
  pale: 'E7F1FB',
  pale2: 'EDF5FF',
  caution: 'FFEFC7',
};

const outFile = path.resolve(__dirname, '..', 'results', 'reports', 'Capstone_Research_Presentation.pptx');
const figDir = path.resolve(__dirname, '..', 'results', 'figures');

function stars(p) {
  if (p < 0.01) return '***';
  if (p < 0.05) return '**';
  if (p < 0.1) return '*';
  return '';
}

function notes(lines) {
  return lines.join('\n');
}

function addBackground(slide, color = C.ice) {
  slide.background = { color };
}

function addTopLabel(slide, label, x = 0.55, y = 0.32) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: 1.95,
    h: 0.34,
    rectRadius: 0.08,
    fill: { color: C.lightBlue },
    line: { color: C.lightBlue, pt: 1 },
  });
  slide.addText(label.toUpperCase(), {
    x,
    y: y + 0.03,
    w: 1.95,
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
    w: 8.8,
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
    y: y + 0.10,
    w: w - 0.32,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 8.5,
    bold: true,
    color: C.muted,
    margin: 0,
  });
  slide.addText(value, {
    x: x + 0.22,
    y: y + 0.28,
    w: w - 0.32,
    h: 0.30,
    fontFace: 'Trebuchet MS',
    fontSize: 17,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText(detail, {
    x: x + 0.22,
    y: y + 0.60,
    w: w - 0.32,
    h: h - 0.66,
    fontFace: 'Aptos',
    fontSize: 9,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
}

function addImageCard(slide, imagePath, x, y, w, h, caption, sourcePath) {
  addCard(slide, x, y, w, h, C.white, C.softBorder, 0.08);
  if (fs.existsSync(imagePath)) {
    slide.addImage({
      path: imagePath,
      x: x + 0.12,
      y: y + 0.12,
      w: w - 0.24,
      h: h - 0.66,
      sizing: { type: 'contain', w: w - 0.24, h: h - 0.66 },
    });
  } else {
    slide.addText('Figure not found in expected path', {
      x: x + 0.16,
      y: y + 0.46,
      w: w - 0.32,
      h: 0.36,
      fontFace: 'Aptos',
      fontSize: 10,
      color: C.muted,
      align: 'center',
      margin: 0,
      fit: 'shrink',
    });
  }
  slide.addText(caption, {
    x: x + 0.14,
    y: y + h - 0.42,
    w: w - 0.28,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 8.8,
    italic: true,
    color: C.muted,
    margin: 0,
    fit: 'shrink',
  });
  if (sourcePath) {
    slide.addText(sourcePath, {
      x: x + 0.14,
      y: y + h - 0.24,
      w: w - 0.28,
      h: 0.15,
      fontFace: 'Aptos',
      fontSize: 7.8,
      color: C.muted,
      margin: 0,
      fit: 'shrink',
    });
  }
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.55,
    y: 7.10,
    w: 8.9,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 8,
    color: C.muted,
    margin: 0,
  });
}

function buildTitleSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: 7.8,
    y: -0.8,
    w: 3.8,
    h: 3.8,
    fill: { color: C.blue, transparency: 74 },
    line: { color: C.blue, transparency: 100, pt: 0 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 8.9,
    y: 3.9,
    w: 2.3,
    h: 2.3,
    fill: { color: C.lightBlue, transparency: 80 },
    line: { color: C.lightBlue, transparency: 100, pt: 0 },
  });

  slide.addText('Corporate Lobbying and\nFirm Profitability', {
    x: 0.72,
    y: 1.0,
    w: 5.2,
    h: 1.30,
    fontFace: 'Trebuchet MS',
    fontSize: 33,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('10-minute executive briefing in plain language\nData window: 2010-2020', {
    x: 0.74,
    y: 2.45,
    w: 4.9,
    h: 0.58,
    fontFace: 'Aptos',
    fontSize: 13,
    color: 'D7E6F7',
    margin: 0,
    fit: 'shrink',
  });

  addMetricCard(slide, 6.1, 1.0, 3.05, 1.0, 'Main FE estimate', '-174.6', 'Lagged lobbying has a negative sign but is not statistically strong.', C.white, C.blue);
  addMetricCard(slide, 6.1, 2.15, 3.05, 1.0, 'p-value', '0.135', 'Uncertainty is high, so use as a caution signal, not proof.', C.white, C.lightBlue);
  addMetricCard(slide, 6.1, 3.30, 3.05, 1.0, 'Main sample', '2,125 rows', 'Firm-year observations after lagging and cleaning.', C.white, C.lightBlue);
  addMetricCard(slide, 6.1, 4.45, 3.05, 1.0, 'Balanced panel', '836 rows', '66 firms with full 2010-2020 histories.', C.white, C.lightBlue);

  slide.addText('Team capstone deck aligned to memo requirements', {
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
    'Timing: about 45 seconds.',
    'Open with one sentence: our best model points to a negative relationship, but the evidence is not strong enough to claim a clean causal effect.',
    'Tell the audience this briefing is intentionally non-technical and focused on decision use, risks, and transparency.',
  ]));
}

function buildExecutiveSummarySlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Executive Summary');
  addSlideTitle(slide, 'What we found and what to do with it', 'Key finding in 2-3 sentences, then a direct recommendation.');

  addCard(slide, 0.55, 1.55, 6.3, 4.45, C.white, C.softBorder, 0.07);
  slide.addText('Key finding (plain language)', {
    x: 0.82,
    y: 1.85,
    w: 5.72,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('In our main model, firms that spent more on lobbying in one year tended to have lower profitability in the next year. The size of that estimate is large, but the uncertainty is also large, so this is a directional signal, not a guaranteed effect. The lag pattern and placebo test suggest timing problems, including possible reverse causality.', {
    x: 0.82,
    y: 2.18,
    w: 5.72,
    h: 1.55,
    fontFace: 'Aptos',
    fontSize: 13.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Recommendation (plain language)', {
    x: 0.82,
    y: 3.95,
    w: 5.72,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Do not treat lobbying intensity as a stand-alone buy signal. For allocation, overweight steadier cash-flow sectors by about 10-15% and underweight policy-sensitive, lobbying-heavy names by about 10%, unless confirmed by stronger fundamentals.', {
    x: 0.82,
    y: 4.28,
    w: 5.72,
    h: 1.15,
    fontFace: 'Aptos',
    fontSize: 12.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addMetricCard(slide, 7.05, 1.55, 2.15, 1.02, 'Magnitude', '-174.6', 'Coefficient on lagged lobbying ($M units).', C.white, C.blue);
  addMetricCard(slide, 7.05, 2.72, 2.15, 1.02, 'Significance', 'p=0.135', 'Not significant at 5 percent.', C.white, C.lightBlue);
  addMetricCard(slide, 7.05, 3.89, 2.15, 1.02, 'Lag', '1 year', 'Effect is measured with a one-year delay.', C.white, C.lightBlue);

  addFooter(slide, 'Executive summary source: results/tables/M3_fixed_effects_coefficients.csv and results/reports/M3_interpretation.md.');
  slide.addNotes(notes([
    'Timing: about 60 seconds.',
    'Say the key result in one breath: negative direction, weak statistical strength, lagged setup.',
    'Give one actionable recommendation with a modest tilt range so it sounds realistic and risk-aware.',
  ]));
}

function buildMethodologySlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Methodology');
  addSlideTitle(slide, 'Data, sample construction, and model setup', 'This slide explains where the numbers came from and how the model was estimated.');

  addCard(slide, 0.55, 1.5, 4.15, 5.05, C.white, C.softBorder, 0.07);
  slide.addText('Data sources with citations', {
    x: 0.82,
    y: 1.78,
    w: 3.4,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('1) SEC XBRL 10-K filings (financial statements)\n2) Senate LDA data via LobbyView (lobbying spend)\n3) CIK-GVKEY crosswalk (entity matching)', {
    x: 0.82,
    y: 2.10,
    w: 3.45,
    h: 1.15,
    fontFace: 'Aptos',
    fontSize: 11.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('Sample construction', {
    x: 0.82,
    y: 3.46,
    w: 3.4,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Date range: 2010-2020\nMerged panel: n=5,099 firm-years, 1,375 firms\nAfter cleaning + lagging + controls: n=2,125\nBalanced panel robustness set: 836 obs, 66 firms', {
    x: 0.82,
    y: 3.78,
    w: 3.45,
    h: 1.55,
    fontFace: 'Aptos',
    fontSize: 11,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 4.95, 1.5, 4.25, 5.05, C.white, C.softBorder, 0.07);
  slide.addText('Model equation and variable definitions', {
    x: 5.22,
    y: 1.78,
    w: 3.6,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('ROA_it = b1*Lobby_i,t-1 + b2*log(Assets_it) + b3*log(Revenue_it) + firm FE + year FE + error_it', {
    x: 5.22,
    y: 2.10,
    w: 3.7,
    h: 0.85,
    fontFace: 'Aptos',
    fontSize: 11.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('ROA: return on assets (profitability)\nLobby_i,t-1: prior-year lobbying spend\nFirm FE: controls for stable firm differences\nYear FE: controls for economy-wide shocks', {
    x: 5.22,
    y: 3.18,
    w: 3.62,
    h: 1.32,
    fontFace: 'Aptos',
    fontSize: 10.6,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  addCard(slide, 5.22, 4.70, 3.7, 1.1, C.pale2, C.lightBlue, 0);
  slide.addText('Standard errors are clustered at the entity (firm) level to handle repeated observations within each company.', {
    x: 5.38,
    y: 4.98,
    w: 3.36,
    h: 0.62,
    fontFace: 'Aptos',
    fontSize: 10.4,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Citations: SEC EDGAR XBRL, LobbyView/Senate LDA, and project crosswalk in data/processed/cik_gvkey_crosswalk.csv.');
  slide.addNotes(notes([
    'Timing: about 60 seconds.',
    'Keep this slide simple: where data came from, how many observations survived cleaning, and why fixed effects plus clustered errors were used.',
    'For non-economists, define fixed effects as comparing each company mostly to itself across time.',
  ]));
}

function buildTable1Slide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Results');
  addSlideTitle(slide, 'Table 1. Main fixed-effects regression', 'Coefficients, clustered SE, t-stats, p-values, stars, FE flags, and N.');

  addCard(slide, 0.55, 1.5, 8.85, 5.0, C.white, C.softBorder, 0.07);

  const rows = [
    [
      { text: 'Variable', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Coef.', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'SE (clustered)', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 't-stat', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'p-value', options: { bold: true, color: C.white, fill: { color: C.navy } } },
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
      { text: 'Log(Revenue)' },
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
    h: 2.25,
    colW: [2.6, 1.05, 1.35, 0.8, 0.85, 0.7],
    rowH: [0.38, 0.52, 0.52, 0.52],
    border: { type: 'solid', color: C.border, pt: 1 },
    fill: C.white,
    margin: 0.06,
    fontFace: 'Aptos',
    fontSize: 9.8,
    color: C.text,
    valign: 'mid',
    align: 'center',
    headerRow: true,
    bandRow: true,
    autoFit: false,
  });

  addMetricCard(slide, 0.82, 4.35, 2.4, 0.95, 'Entity FE', 'Yes', 'Firm fixed effects included.', C.pale2, C.blue);
  addMetricCard(slide, 3.40, 4.35, 2.4, 0.95, 'Year FE', 'Yes', 'Year fixed effects included.', C.pale2, C.lightBlue);
  addMetricCard(slide, 5.98, 4.35, 2.4, 0.95, 'N', '2,125', 'Main estimation sample size.', C.pale2, C.lightBlue);

  addCard(slide, 0.82, 5.48, 8.32, 0.84, C.pale, C.lightBlue, 0);
  slide.addText('Interpretation: roughly, an extra $100K in lobbying is linked with about a 17.5-point lower ROA in the next year, but this estimate is not statistically decisive.', {
    x: 1.02,
    y: 5.75,
    w: 7.95,
    h: 0.30,
    fontFace: 'Aptos',
    fontSize: 11,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Stars: * p<0.10, ** p<0.05, *** p<0.01. Source: results/tables/M3_fixed_effects_coefficients.csv.');
  slide.addNotes(notes([
    'Timing: about 60 seconds.',
    'Walk left to right once: coefficient, uncertainty, test statistic, p-value, and stars.',
    'Plain-language close: the direction is negative, but we cannot call it a firm causal estimate at standard confidence levels.',
  ]));
}

function buildTable2AndFigure1Slide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Results');
  addSlideTitle(slide, 'Table 2. Alternative spec and Figure 1', 'Alternative models plus a key visual of outcome vs. driver.');

  addCard(slide, 0.55, 1.52, 4.1, 4.95, C.white, C.softBorder, 0.07);

  const altRows = [
    [
      { text: 'Spec', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Result', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Readout', options: { bold: true, color: C.white, fill: { color: C.navy } } },
    ],
    [{ text: 'Three-way FE' }, { text: '-159.5, p=0.367' }, { text: 'Sign stays negative, still weak.' }],
    [{ text: 'DiD (ATT)' }, { text: '-338.8' }, { text: 'Negative average effect, uncertain precision.' }],
    [{ text: 'Lead-1 placebo' }, { text: '-302.7*' }, { text: 'Reverse timing is a concern.' }],
    [{ text: 'ARIMA(0,1,0)' }, { text: 'RMSE=523.5' }, { text: 'No gain over naive benchmark.' }],
    [{ text: 'Bootstrap CI' }, { text: '[-517.6, 149.7]' }, { text: 'Interval crosses zero.' }],
  ];

  slide.addTable(altRows, {
    x: 0.78,
    y: 1.84,
    w: 3.6,
    h: 4.12,
    colW: [1.0, 1.2, 1.4],
    rowH: [0.38, 0.52, 0.52, 0.52, 0.52, 0.52],
    border: { type: 'solid', color: C.border, pt: 1 },
    fill: C.white,
    margin: 0.05,
    fontFace: 'Aptos',
    fontSize: 8.5,
    color: C.text,
    valign: 'mid',
    align: 'center',
    headerRow: true,
    bandRow: true,
    autoFit: false,
  });

  const fig1 = path.join(figDir, 'M2', 'plot3_dual_axis_outcome_driver.png');
  addImageCard(
    slide,
    fig1,
    4.95,
    1.52,
    4.25,
    4.95,
    'Figure 1. Dual-axis trend of profitability outcome vs. lobbying driver',
    '../figures/M2/plot3_dual_axis_outcome_driver.png'
  );

  addFooter(slide, 'Table 2 sources: results/tables/M3_bonus_did_summary.txt, results/tables/M3_arima_metrics.csv, and robustness tables.');
  slide.addNotes(notes([
    'Timing: about 55 seconds.',
    'Say this clearly: most alternatives keep a negative sign, but confidence is still limited because intervals are wide and timing is messy.',
    'Point to Figure 1 as context, not proof: the visual motivates the relationship but does not identify causality by itself.',
  ]));
}

function buildFigure2InterpretationSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Diagnostics');
  addSlideTitle(slide, 'Figure 2. Diagnostics and economic interpretation', 'Diagnostic fit checks plus translation of the coefficient into business terms.');

  const resid = path.join(figDir, 'M3_residuals_vs_fitted.png');
  const qq = path.join(figDir, 'M3_qq_plot.png');
  addImageCard(slide, resid, 0.55, 1.55, 4.15, 3.15, 'Figure 2A. Residuals vs. fitted', '../figures/M3_residuals_vs_fitted.png');
  addImageCard(slide, qq, 4.95, 1.55, 4.15, 3.15, 'Figure 2B. Q-Q plot', '../figures/M3_qq_plot.png');

  addCard(slide, 0.55, 4.95, 8.55, 1.35, C.pale2, C.lightBlue, 0);
  slide.addText('Economic magnitude: a $1M increase in lobbying maps to about -174.6 points in next-year ROA in this model. Robustness and theory check: negative sign aligns with defensive-lobbying theory, but the wide uncertainty and placebo lead mean we should treat this as suggestive, not definitive.', {
    x: 0.82,
    y: 5.20,
    w: 8.0,
    h: 0.74,
    fontFace: 'Aptos',
    fontSize: 10.5,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Diagnostics from results/reports/M3_diagnostics_summary.txt and results/tables/M3_vif_results.csv.');
  slide.addNotes(notes([
    'Timing: about 55 seconds.',
    'Explain in simple terms that the diagnostics show noisy errors, which is why robust clustered uncertainty estimates matter.',
    'Then translate the coefficient to an economic magnitude but immediately pair it with the uncertainty warning.',
  ]));
}

function buildConclusionsRecommendationsSlide() {
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

  slide.addText('Conclusions and\nRecommendations', {
    x: 0.72,
    y: 0.88,
    w: 5.0,
    h: 1.1,
    fontFace: 'Trebuchet MS',
    fontSize: 30,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.95, 0.85, 3.75, 2.35, C.white, C.softBorder, 0.08);
  slide.addText('Investment implications', {
    x: 6.2,
    y: 1.1,
    w: 3.2,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Sector tilt: overweight stable Industrials/Health Care by ~10-15%. Underweight lobbying-heavy, policy-sensitive buckets by ~10%.', {
    x: 6.2,
    y: 1.45,
    w: 3.25,
    h: 0.78,
    fontFace: 'Aptos',
    fontSize: 11,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });
  slide.addText('Factor tilt: quality and earnings stability over policy exposure. Scenario: if lag effect is real, underweight should help with delay; if reverse causality dominates, edge fades.', {
    x: 6.2,
    y: 2.23,
    w: 3.25,
    h: 0.85,
    fontFace: 'Aptos',
    fontSize: 10.2,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 0.74, 2.15, 4.95, 3.85, C.white, C.softBorder, 0.08);
  slide.addText('Risk assessment and caveats', {
    x: 1.0,
    y: 2.45,
    w: 4.45,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('- FE assumption: time-varying omitted variables may remain.\n- DiD assumption: treatment timing may not satisfy clean parallel trends.\n- Data limitation: lobbying coverage is sparse; sample may over-represent larger firms.\n- External validity: findings may not transfer to private firms or non-U.S. settings.', {
    x: 1.0,
    y: 2.84,
    w: 4.45,
    h: 2.85,
    fontFace: 'Aptos',
    fontSize: 10.4,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Bottom line: use lobbying as a caution flag, not a core alpha signal.', {
    x: 0.74,
    y: 6.18,
    w: 4.95,
    h: 0.30,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'Timing: about 65 seconds.',
    'State the recommendation as a moderate tilt, not an all-in call.',
    'Be explicit about risk assumptions so the audience trusts the honesty of the recommendation.',
  ]));
}

function buildAddendumTemplateSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Individual Addendum');
  addSlideTitle(slide, 'Individual addendum template (what to include)', 'Use this structure directly in individual submission pages.');

  addCard(slide, 0.55, 1.55, 4.2, 4.95, C.white, C.softBorder, 0.07);
  slide.addText('Personal contribution (2-4 bullets)', {
    x: 0.82,
    y: 1.85,
    w: 3.7,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 13,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('- Led M1 data cleaning and merge (20 hrs)\n- Built M2 lag analysis visuals (14 hrs)\n- Implemented M3 FE and robustness checks (18 hrs)', {
    x: 0.82,
    y: 2.20,
    w: 3.7,
    h: 1.25,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Defended decision (1 choice + evidence)', {
    x: 0.82,
    y: 3.65,
    w: 3.7,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 13,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Used a one-year lag because M2 patterns were strongest at 1-2 years and economic logic suggests policy effects are delayed.', {
    x: 0.82,
    y: 4.00,
    w: 3.7,
    h: 0.85,
    fontFace: 'Aptos',
    fontSize: 10.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.0, 1.55, 4.2, 4.95, C.white, C.softBorder, 0.07);
  slide.addText('Key limitation', {
    x: 5.27,
    y: 1.85,
    w: 3.7,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 13,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Lobbying participation is sparse and uneven, so estimated effects may mostly reflect larger firms and may miss smaller-firm behavior.', {
    x: 5.27,
    y: 2.20,
    w: 3.7,
    h: 0.9,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('AI audit notes', {
    x: 5.27,
    y: 3.35,
    w: 3.7,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 13,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Document prompt, model output, and manual verification steps for any AI-assisted edits not already in the team appendix.', {
    x: 5.27,
    y: 3.70,
    w: 3.7,
    h: 0.85,
    fontFace: 'Aptos',
    fontSize: 10.5,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.27, 4.75, 3.7, 1.2, C.pale2, C.lightBlue, 0);
  slide.addText('Template reference: individual_addendum_template.md', {
    x: 5.45,
    y: 5.08,
    w: 3.35,
    h: 0.3,
    fontFace: 'Aptos',
    fontSize: 10.2,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Keep addendum specific: tasks, hours, one defended decision, one limitation, and AI verification details.');
  slide.addNotes(notes([
    'Timing: about 50 seconds.',
    'Present this as a checklist that protects both grading clarity and academic integrity.',
    'Encourage each team member to customize hours and examples with real milestone work.',
  ]));
}

function buildRubricSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Rubric');
  addSlideTitle(slide, 'Grading rubric summary (50 points)', 'What graders are scoring and the reproducibility expectation.');

  addCard(slide, 0.55, 1.55, 8.65, 4.2, C.white, C.softBorder, 0.07);

  const rubricRows = [
    [
      { text: 'Component', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'Points', options: { bold: true, color: C.white, fill: { color: C.navy } } },
      { text: 'What strong work looks like', options: { bold: true, color: C.white, fill: { color: C.navy } } },
    ],
    [{ text: 'Reproducibility and rigor' }, { text: '10' }, { text: 'M1-M3 code runs end-to-end and matches memo outputs.' }],
    [{ text: 'Structure and clarity' }, { text: '10' }, { text: 'Clean organization and non-jargon explanations.' }],
    [{ text: 'Results and interpretation' }, { text: '12' }, { text: 'Publication-ready tables/figures and economic meaning.' }],
    [{ text: 'Recommendations and caveats' }, { text: '8' }, { text: 'Actionable advice plus honest limitations.' }],
    [{ text: 'Individual addendum' }, { text: '10' }, { text: 'Specific contribution, defended choice, key caveat.' }],
  ];

  slide.addTable(rubricRows, {
    x: 0.82,
    y: 1.84,
    w: 8.12,
    h: 3.50,
    colW: [2.2, 0.75, 5.17],
    rowH: [0.38, 0.54, 0.54, 0.54, 0.54, 0.54],
    border: { type: 'solid', color: C.border, pt: 1 },
    fill: C.white,
    margin: 0.05,
    fontFace: 'Aptos',
    fontSize: 9.2,
    color: C.text,
    valign: 'mid',
    align: 'center',
    headerRow: true,
    bandRow: true,
    autoFit: false,
  });

  addCard(slide, 0.82, 5.48, 8.12, 0.95, C.caution, C.lightBlue, 0);
  slide.addText('Reproducibility note: M4 is submitted as PDFs, but grading still expects your existing capstone code to run and reproduce memo numbers and figures.', {
    x: 1.02,
    y: 5.78,
    w: 7.75,
    h: 0.30,
    fontFace: 'Aptos',
    fontSize: 10.8,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Detailed criteria reference: rubric.md');
  slide.addNotes(notes([
    'Timing: about 50 seconds.',
    'Highlight that reproducibility is not optional: the code-output chain has to be consistent with the memo tables and figures.',
    'Use this slide to set expectations and avoid preventable point losses.',
  ]));
}

function buildPitfallsSlide() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Quality Control');
  addSlideTitle(slide, 'Common pitfalls and how to avoid them', 'Especially important: executive summary language should stay non-technical.');

  addCard(slide, 0.55, 1.55, 4.2, 4.95, C.white, C.softBorder, 0.07);
  slide.addText('Pitfalls', {
    x: 0.82,
    y: 1.86,
    w: 3.7,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('- Executive summary is too technical\n- Tables shown without practical meaning\n- Recommendations ignore uncertainty\n- Limitations listed vaguely instead of specifically', {
    x: 0.82,
    y: 2.18,
    w: 3.7,
    h: 2.8,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.0, 1.55, 4.2, 4.95, C.white, C.softBorder, 0.07);
  slide.addText('Fixes', {
    x: 5.27,
    y: 1.86,
    w: 3.7,
    h: 0.20,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('- Use one sentence for direction and one for confidence\n- Translate every key coefficient into business language\n- Tie every recommendation to a risk statement\n- Name one concrete data limitation and why it matters', {
    x: 5.27,
    y: 2.18,
    w: 3.7,
    h: 2.8,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 0.82, 5.48, 8.12, 0.95, C.pale2, C.lightBlue, 0);
  slide.addText('Final speaking rule: if a non-economist cannot explain your takeaway after 30 seconds, simplify the slide wording and notes.', {
    x: 1.02,
    y: 5.78,
    w: 7.75,
    h: 0.30,
    fontFace: 'Aptos',
    fontSize: 10.8,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Use this checklist in final rehearsal before exporting the submission PDF.');
  slide.addNotes(notes([
    'Timing: about 45 seconds.',
    'Close the deck with a quality checklist so the audience sees you are controlling for communication risk, not just model risk.',
    'Remind presenters to keep language simple and recommendation statements conditional on uncertainty.',
  ]));
}

function buildClosingSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: -0.8,
    y: 4.3,
    w: 3.0,
    h: 3.0,
    fill: { color: C.blue, transparency: 75 },
    line: { color: C.blue, transparency: 100, pt: 0 },
  });

  slide.addText('Thank You', {
    x: 0.9,
    y: 2.2,
    w: 3.2,
    h: 0.5,
    fontFace: 'Trebuchet MS',
    fontSize: 36,
    bold: true,
    color: C.white,
    margin: 0,
  });

  slide.addText('Questions and discussion', {
    x: 0.9,
    y: 2.85,
    w: 3.6,
    h: 0.32,
    fontFace: 'Aptos',
    fontSize: 14,
    color: 'D7E6F7',
    margin: 0,
  });

  addCard(slide, 5.0, 1.35, 4.2, 2.9, C.white, C.softBorder, 0.08);
  slide.addText('One-line recap', {
    x: 5.27,
    y: 1.66,
    w: 3.7,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Lobbying appears correlated with weaker later profitability in our panel, but uncertainty and timing effects mean investors should apply the signal cautiously and alongside fundamentals.', {
    x: 5.27,
    y: 2.00,
    w: 3.7,
    h: 1.45,
    fontFace: 'Aptos',
    fontSize: 11,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'Timing: about 35 seconds.',
    'Use this slide only to invite questions and repeat the cautious recommendation once.',
  ]));
}

buildTitleSlide();
buildExecutiveSummarySlide();
buildMethodologySlide();
buildTable1Slide();
buildTable2AndFigure1Slide();
buildFigure2InterpretationSlide();
buildConclusionsRecommendationsSlide();
buildAddendumTemplateSlide();
buildRubricSlide();
buildPitfallsSlide();
buildClosingSlide();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
pptx.writeFile({ fileName: outFile }).then(() => {
  console.log(`Presentation created: ${outFile}`);
});
