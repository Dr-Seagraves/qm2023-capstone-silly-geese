#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'QM 2023 Capstone Team';
pptx.company = 'QM 2023';
pptx.title = 'Corporate Lobbying and Firm Profitability';
pptx.subject = 'Capstone presentation';
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
  pale: 'EDF5FF',
};

const outFile = path.resolve(__dirname, '..', 'results', 'reports', 'Capstone_Research_Presentation.pptx');
const figDir = path.resolve(__dirname, '..', 'results', 'figures');

function notes(lines) {
  return lines.join('\n');
}

function addBackground(slide, color = C.ice) {
  slide.background = { color };
}

function addTopLabel(slide, label) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55,
    y: 0.30,
    w: 2.2,
    h: 0.34,
    rectRadius: 0.08,
    fill: { color: C.lightBlue },
    line: { color: C.lightBlue, pt: 1 },
  });
  slide.addText(label.toUpperCase(), {
    x: 0.55,
    y: 0.33,
    w: 2.2,
    h: 0.22,
    fontFace: 'Trebuchet MS',
    fontSize: 9,
    bold: true,
    color: C.navy,
    align: 'center',
    margin: 0,
    charSpacing: 1,
  });
}

function addSlideTitle(slide, title, subtitle = '') {
  slide.addText(title, {
    x: 0.55,
    y: 0.72,
    w: 8.9,
    h: subtitle ? 0.48 : 0.38,
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
      h: 0.32,
      fontFace: 'Aptos',
      fontSize: 11,
      color: C.muted,
      margin: 0,
      fit: 'shrink',
    });
  }
}

function addCard(slide, x, y, w, h, fill = C.white, line = C.softBorder) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.09,
    fill: { color: fill },
    line: { color: line, pt: 1 },
    shadow: { type: 'outer', color: '000000', blur: 3, offset: 1.4, angle: 45, opacity: 0.08 },
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.55,
    y: 7.08,
    w: 8.9,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 8,
    color: C.muted,
    margin: 0,
  });
}

function addImageCard(slide, imagePath, x, y, w, h, caption) {
  addCard(slide, x, y, w, h, C.white, C.softBorder);
  if (fs.existsSync(imagePath)) {
    slide.addImage({
      path: imagePath,
      x: x + 0.12,
      y: y + 0.12,
      w: w - 0.24,
      h: h - 0.56,
      sizing: { type: 'contain', w: w - 0.24, h: h - 0.56 },
    });
  } else {
    slide.addText('Image not found', {
      x: x + 0.2,
      y: y + 0.45,
      w: w - 0.4,
      h: 0.3,
      fontFace: 'Aptos',
      fontSize: 11,
      color: C.muted,
      align: 'center',
      margin: 0,
      fit: 'shrink',
    });
  }
  slide.addText(caption, {
    x: x + 0.14,
    y: y + h - 0.30,
    w: w - 0.28,
    h: 0.16,
    fontFace: 'Aptos',
    fontSize: 8.5,
    italic: true,
    color: C.muted,
    margin: 0,
    fit: 'shrink',
  });
}

function slide1Title() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: 8.0,
    y: -0.8,
    w: 3.6,
    h: 3.6,
    fill: { color: C.blue, transparency: 75 },
    line: { color: C.blue, transparency: 100, pt: 0 },
  });

  slide.addText('Corporate Lobbying and\nFirm Profitability', {
    x: 0.78,
    y: 1.25,
    w: 5.4,
    h: 1.25,
    fontFace: 'Trebuchet MS',
    fontSize: 34,
    bold: true,
    color: C.white,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Capstone Presentation\n2010-2020 Panel Analysis', {
    x: 0.8,
    y: 2.75,
    w: 4.5,
    h: 0.6,
    fontFace: 'Aptos',
    fontSize: 14,
    color: 'D7E6F7',
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 6.0, 1.3, 3.3, 3.6, C.white, C.softBorder);
  slide.addText('Today\'s flow', {
    x: 6.25,
    y: 1.6,
    w: 2.8,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('1) Research question and hypothesis\n2) Three data sources\n3) Methodology\n4) Findings with graphs\n5) Thank you and Q&A', {
    x: 6.25,
    y: 2.0,
    w: 2.8,
    h: 2.2,
    fontFace: 'Aptos',
    fontSize: 11.2,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'Hi everyone, and thank you for being here.',
    'Today we will walk through one simple question: does spending more money on lobbying help a company become more profitable later?',
    'I will keep this presentation in simple language. We will cover our question, our hypothesis, our data, our method, and then our findings with graphs.',
    'At the end, we will leave time for questions.',
  ]));
}

function slide2QuestionHypothesis() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Slide 2');
  addSlideTitle(slide, 'Research Question and Hypothesis');

  addCard(slide, 0.55, 1.55, 8.9, 4.9, C.white, C.softBorder);

  slide.addText('Research question', {
    x: 0.85,
    y: 1.9,
    w: 8.3,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Do firms that spend more on lobbying in one year show higher profitability in the following year?', {
    x: 0.85,
    y: 2.25,
    w: 8.3,
    h: 0.8,
    fontFace: 'Aptos',
    fontSize: 15,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Hypothesis', {
    x: 0.85,
    y: 3.4,
    w: 8.3,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 16,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Our hypothesis was: more lobbying expenditures would result in higher profitability.', {
    x: 0.85,
    y: 3.75,
    w: 8.3,
    h: 0.8,
    fontFace: 'Aptos',
    fontSize: 15,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 0.85, 4.9, 8.3, 1.2, C.pale, C.lightBlue);
  slide.addText('In plain terms: we expected that money spent on policy influence would help business outcomes later.', {
    x: 1.05,
    y: 5.3,
    w: 7.9,
    h: 0.4,
    fontFace: 'Aptos',
    fontSize: 11.8,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'This is our core question and our original expectation.',
    'Our hypothesis was straightforward: if a company spends more on lobbying, then later profitability should go up.',
    'The reason is that firms may gain policy advantages, avoid costly rules, or reduce uncertainty.',
    'So, before seeing the results, we expected a positive relationship.',
  ]));
}

function slide3DataSources() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Slide 3');
  addSlideTitle(slide, 'Our Three Data Sources (Including Crosswalk)');

  addCard(slide, 0.55, 1.55, 2.8, 4.9, C.white, C.softBorder);
  addCard(slide, 3.6, 1.55, 2.8, 4.9, C.white, C.softBorder);
  addCard(slide, 6.65, 1.55, 2.8, 4.9, C.white, C.softBorder);

  slide.addText('1) Financial Data', {
    x: 0.8,
    y: 1.9,
    w: 2.3,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Source: SEC XBRL 10-K filings\nWe used firm financials like assets, revenue, and net income to build profitability measures.', {
    x: 0.8,
    y: 2.25,
    w: 2.35,
    h: 2.2,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('2) Lobbying Data', {
    x: 3.85,
    y: 1.9,
    w: 2.3,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Source: Senate disclosures via LobbyView\nWe used annual lobbying spending by firm to track political activity over time.', {
    x: 3.85,
    y: 2.25,
    w: 2.35,
    h: 2.2,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('3) Crosswalk File', {
    x: 6.9,
    y: 1.9,
    w: 2.3,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 14,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Source: CIK-GVKEY crosswalk\nThis file links firm IDs across datasets so we can correctly merge financial and lobbying records.', {
    x: 6.9,
    y: 2.25,
    w: 2.35,
    h: 2.2,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 0.8, 4.95, 8.4, 1.15, C.pale, C.lightBlue);
  slide.addText('Why this matters: without the crosswalk, we would be matching the wrong firms and our analysis would not be valid.', {
    x: 1.0,
    y: 5.3,
    w: 8.0,
    h: 0.35,
    fontFace: 'Aptos',
    fontSize: 11.5,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Files used: data/processed/financials_clean.csv, data/processed/lobbying_clean.csv, and data/processed/cik_gvkey_crosswalk.csv.');

  slide.addNotes(notes([
    'Here are our three data sources.',
    'First, we use SEC financial data for company performance.',
    'Second, we use lobbying spending data from Senate disclosures through LobbyView.',
    'Third, and very important, we use a crosswalk file that connects company IDs between those two sources.',
    'That crosswalk is what makes a clean merge possible. Without it, we risk comparing data from different firms by mistake.',
  ]));
}

function slide4Methodology() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Slide 4');
  addSlideTitle(slide, 'Methodology');

  addCard(slide, 0.55, 1.55, 4.3, 4.9, C.white, C.softBorder);
  addCard(slide, 5.05, 1.55, 4.4, 4.9, C.white, C.softBorder);

  slide.addText('Step-by-step process', {
    x: 0.82,
    y: 1.9,
    w: 3.8,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('1) Cleaned each dataset\n2) Merged using the crosswalk\n3) Built a firm-year panel from 2010 to 2020\n4) Tested how next-year profitability changes with prior-year lobbying spend\n5) Added firm and year controls to reduce bias', {
    x: 0.82,
    y: 2.25,
    w: 3.9,
    h: 2.7,
    fontFace: 'Aptos',
    fontSize: 11.2,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 0.82, 5.05, 3.9, 1.1, C.pale, C.lightBlue);
  slide.addText('Plain English: we compare each firm mostly to itself over time.', {
    x: 1.0,
    y: 5.42,
    w: 3.5,
    h: 0.3,
    fontFace: 'Aptos',
    fontSize: 11,
    bold: true,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  slide.addText('Model summary', {
    x: 5.32,
    y: 1.9,
    w: 3.8,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Outcome: ROA (profitability)\nMain predictor: lobbying spend from the previous year\nControls: firm size and year effects\nUncertainty: clustered standard errors at firm level', {
    x: 5.32,
    y: 2.25,
    w: 3.9,
    h: 2.3,
    fontFace: 'Aptos',
    fontSize: 11.2,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addCard(slide, 5.32, 4.75, 3.9, 1.4, C.pale, C.lightBlue);
  slide.addText('Simple equation idea:\nProfitability today = lobbying last year + company factors + year factors', {
    x: 5.52,
    y: 5.08,
    w: 3.5,
    h: 0.8,
    fontFace: 'Aptos',
    fontSize: 10.8,
    color: C.navy,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'This slide explains how we did the analysis.',
    'First, we cleaned and merged the data. Then we created a panel across years for each firm.',
    'Our main test asks: if lobbying goes up this year, what happens to profitability next year?',
    'We use controls and firm-level clustering so our estimate is more stable and less likely to be driven by simple noise.',
    'In simple terms, we are not just comparing different firms to each other. We are mostly tracking changes within the same firm over time.',
  ]));
}

function slide5Findings() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addTopLabel(slide, 'Slide 5');
  addSlideTitle(slide, 'Findings (With Graphs)');

  const fig1 = path.join(figDir, 'M2', 'plot3_dual_axis_outcome_driver.png');
  const fig2 = path.join(figDir, 'M2', 'plot4_lagged_effect_analysis.png');

  addImageCard(slide, fig1, 0.55, 1.55, 4.35, 3.05, 'Figure 1: Outcome vs. driver over time');
  addImageCard(slide, fig2, 5.1, 1.55, 4.35, 3.05, 'Figure 2: Lagged relationship analysis');

  addCard(slide, 0.55, 4.85, 8.9, 1.6, C.white, C.softBorder);
  slide.addText('Main findings in simple terms', {
    x: 0.82,
    y: 5.1,
    w: 8.4,
    h: 0.24,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('Our main model did not confirm our original hypothesis. Instead of higher profitability, the estimated relationship was negative and not statistically strong. In plain terms: spending more on lobbying did not reliably predict better profits in the following year in our sample.', {
    x: 0.82,
    y: 5.45,
    w: 8.4,
    h: 0.8,
    fontFace: 'Aptos',
    fontSize: 11.3,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  addFooter(slide, 'Graph paths: ../figures/M2/plot3_dual_axis_outcome_driver.png and ../figures/M2/plot4_lagged_effect_analysis.png');

  slide.addNotes(notes([
    'Now for our findings.',
    'The key takeaway is that our original hypothesis was not supported by the main model.',
    'We expected a positive relationship, but the estimated relationship was negative and not statistically strong.',
    'That means we should be careful: we cannot say lobbying spending clearly causes higher profitability in this dataset.',
    'The graphs help show the pattern and timing, but the model uncertainty is still important.',
  ]));
}

function slide6Thanks() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: -0.8,
    y: 4.2,
    w: 3.0,
    h: 3.0,
    fill: { color: C.blue, transparency: 75 },
    line: { color: C.blue, transparency: 100, pt: 0 },
  });

  slide.addText('Thank You', {
    x: 0.9,
    y: 2.05,
    w: 3.8,
    h: 0.6,
    fontFace: 'Trebuchet MS',
    fontSize: 42,
    bold: true,
    color: C.white,
    margin: 0,
  });

  slide.addText('Questions?', {
    x: 0.95,
    y: 2.8,
    w: 3.2,
    h: 0.35,
    fontFace: 'Aptos',
    fontSize: 20,
    color: 'D7E6F7',
    margin: 0,
  });

  addCard(slide, 5.0, 1.35, 4.2, 2.9, C.white, C.softBorder);
  slide.addText('Quick recap', {
    x: 5.25,
    y: 1.65,
    w: 3.7,
    h: 0.2,
    fontFace: 'Trebuchet MS',
    fontSize: 15,
    bold: true,
    color: C.navy,
    margin: 0,
  });
  slide.addText('We tested whether more lobbying spending leads to higher profitability. Using merged firm data and a panel model, we found that this effect was not clearly positive in our sample.', {
    x: 5.25,
    y: 2.0,
    w: 3.7,
    h: 1.55,
    fontFace: 'Aptos',
    fontSize: 11.2,
    color: C.text,
    margin: 0,
    fit: 'shrink',
  });

  slide.addNotes(notes([
    'Thank you for listening.',
    'To summarize one last time: we tested whether higher lobbying spending leads to higher profitability, and we did not find strong evidence for that in this sample.',
    'We are happy to answer questions about the data, method, or interpretation.',
  ]));
}

slide1Title();
slide2QuestionHypothesis();
slide3DataSources();
slide4Methodology();
slide5Findings();
slide6Thanks();

fs.mkdirSync(path.dirname(outFile), { recursive: true });
pptx.writeFile({ fileName: outFile }).then(() => {
  console.log(`Presentation created: ${outFile}`);
});
