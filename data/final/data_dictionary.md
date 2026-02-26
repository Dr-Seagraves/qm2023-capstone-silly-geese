# Data Dictionary: Final Analysis Datasets

This document describes the two final analysis datasets in this folder:

- `merged_financials_lobbying.csv`
- `merged_financials_lobbying_balanced.csv`

## Files

### `merged_financials_lobbying.csv`
Merged firm-year panel combining cleaned financials and lobbying expenditures.

- **Unit of observation:** firm-year
- **Merge keys:** `gvkey`, `year` (after linking `cik` to `gvkey` via crosswalk)
- **Coverage:** includes all merged rows, including rows with missing lobbying values when no match is found

### `merged_financials_lobbying_balanced.csv`
Balanced subset of the merged panel.

- **Unit of observation:** firm-year
- **Balanced panel rule:** keeps only firms (`cik`) observed in **every year from 2010 to 2020**
- **Columns:** same schema as `merged_financials_lobbying.csv`

## Variable Definitions

| Variable | Type | Description | Construction / Source |
|---|---|---|---|
| `cik` | integer | SEC Central Index Key firm identifier | From cleaned financials (`financials_clean.csv`) |
| `name` | string | Firm name from SEC financial records | From cleaned financials |
| `year` | integer | Calendar year of observation | Derived during cleaning from filing/report year |
| `Assets` | numeric (USD) | Total assets for the firm-year | From SEC XBRL financial data |
| `NetIncomeLoss` | numeric (USD) | Net income (loss) for the firm-year | From SEC XBRL financial data |
| `Revenues` | numeric (USD) | Firm revenues for the firm-year | From SEC XBRL financial data |
| `gvkey` | string/integer identifier | Firm identifier used to connect to lobbying data | Matched from `cik` using `cik_gvkey_crosswalk.csv` |
| `lobbying_spend` | numeric (USD) | Annual total lobbying expenditures | From aggregated lobbying data (`lobbying_clean.csv`) merged on `gvkey`, `year` |
| `roa` | numeric | Return on Assets | Computed as `NetIncomeLoss / Assets`; set to missing when `Assets == 0` |

## Notes on Missing Values

- `lobbying_spend` may be missing when a firm-year has financial data but no lobbying match.
- `gvkey` may be missing when no confident `cik`-to-`gvkey` crosswalk match was found.
- `roa` may be missing when `Assets` is missing or equal to zero.
