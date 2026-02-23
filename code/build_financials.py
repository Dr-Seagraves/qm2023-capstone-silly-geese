"""
Build firm-year financials panel from SEC Financial Statement Data Sets (Q4 only).

Pipeline:
1) Loop years 2010-2020 (Q4 folders)
2) Read num.txt and sub.txt
3) Keep only 10-K filings in sub.txt
4) Merge num + sub on adsh
5) Keep tags: Assets, NetIncomeLoss, and Revenues (including common alternate revenue tags)
6) Keep USD values only
7) Add year from folder
8) Combine all years
9) Pivot to firm-year format indexed by CIK + name + year
10) Save to data/processed/financials_clean.csv
"""

from __future__ import annotations

from io import BytesIO
from pathlib import Path
from zipfile import ZipFile

import pandas as pd
import requests

from config_paths import PROCESSED_DATA_DIR, RAW_DATA_DIR

START_YEAR = 2010
END_YEAR = 2020
QUARTER = "q4"

TARGET_TAGS = {"Assets", "NetIncomeLoss", "Revenues"}
TARGET_FORM = "10-K"
TARGET_UOM = "USD"

REVENUE_TAG_PRIORITY = [
    "Revenues",
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "SalesRevenueNet",
    "SalesRevenueGoodsNet",
]

REVENUE_TAGS = set(REVENUE_TAG_PRIORITY)
TARGET_TAGS = {"Assets", "NetIncomeLoss"} | REVENUE_TAGS

TAG_NORMALIZATION = {
    "Assets": "Assets",
    "NetIncomeLoss": "NetIncomeLoss",
    "Revenues": "Revenues",
    "RevenueFromContractWithCustomerExcludingAssessedTax": "Revenues",
    "SalesRevenueNet": "Revenues",
    "SalesRevenueGoodsNet": "Revenues",
}

REVENUE_PRIORITY_MAP = {
    tag: rank for rank, tag in enumerate(REVENUE_TAG_PRIORITY)
}

REQUEST_HEADERS = {
    "User-Agent": "Research Project research@example.edu",
}


def sec_zip_urls(year: int) -> list[str]:
    """Candidate SEC zip URLs for a year-quarter dataset."""
    dataset = f"{year}{QUARTER}.zip"
    return [
        f"https://www.sec.gov/files/dera/data/financial-statement-data-sets/{dataset}",
        f"https://www.sec.gov/files/node/add/data_distribution/{dataset}",
    ]


def ensure_local_q4_folder(year: int, base_dir: Path) -> Path:
    """
    Ensure local folder exists for year-q4 dataset by downloading/extracting if needed.

    Returns path like: data/raw/sec_financial_statement_data_sets/2010q4
    """
    folder_name = f"{year}{QUARTER}"
    target_dir = base_dir / folder_name

    if (target_dir / "num.txt").exists() and (target_dir / "sub.txt").exists():
        return target_dir

    target_dir.mkdir(parents=True, exist_ok=True)

    last_error: Exception | None = None
    session = requests.Session()
    session.headers.update(REQUEST_HEADERS)

    for url in sec_zip_urls(year):
        try:
            response = session.get(url, timeout=60)
            response.raise_for_status()

            with ZipFile(BytesIO(response.content)) as zip_file:
                zip_file.extractall(target_dir)

            # Some archives contain a nested YYYYq4/ directory.
            nested_dir = target_dir / folder_name
            if nested_dir.exists() and nested_dir.is_dir():
                for filename in ("num.txt", "sub.txt"):
                    nested_file = nested_dir / filename
                    if nested_file.exists() and not (target_dir / filename).exists():
                        nested_file.replace(target_dir / filename)

            if (target_dir / "num.txt").exists() and (target_dir / "sub.txt").exists():
                return target_dir

            raise FileNotFoundError(
                f"Downloaded {folder_name} but did not find num.txt/sub.txt after extraction."
            )

        except Exception as exc:  # noqa: BLE001
            last_error = exc

    raise RuntimeError(f"Failed to download/extract SEC dataset for {folder_name}: {last_error}")


def process_year(year: int, datasets_base_dir: Path) -> pd.DataFrame:
    """Load and process a single year-q4 SEC dataset."""
    folder_path = ensure_local_q4_folder(year, datasets_base_dir)

    num = pd.read_csv(folder_path / "num.txt", sep="\t", low_memory=False)
    sub = pd.read_csv(folder_path / "sub.txt", sep="\t", low_memory=False)

    sub_10k = sub.loc[sub["form"] == TARGET_FORM, ["adsh", "cik", "name"]].copy()

    merged = num.merge(sub_10k, on="adsh", how="inner")

    filtered = merged.loc[
        merged["tag"].isin(TARGET_TAGS) & (merged["uom"] == TARGET_UOM),
        ["cik", "name", "tag", "value"],
    ].copy()

    filtered["source_tag"] = filtered["tag"]
    filtered["tag"] = filtered["tag"].map(TAG_NORMALIZATION)

    filtered["year"] = year
    return filtered


def build_financials() -> pd.DataFrame:
    """Build full firm-year financials panel for 2010-2020 Q4."""
    datasets_base_dir = RAW_DATA_DIR / "sec_financial_statement_data_sets"
    datasets_base_dir.mkdir(parents=True, exist_ok=True)

    long_frames: list[pd.DataFrame] = []

    for year in range(START_YEAR, END_YEAR + 1):
        print(f"Processing {year}{QUARTER}...")
        year_df = process_year(year, datasets_base_dir)
        long_frames.append(year_df)

    long_all = pd.concat(long_frames, ignore_index=True)

    long_all["revenue_priority"] = long_all["source_tag"].map(REVENUE_PRIORITY_MAP).fillna(0)

    deduped = (
        long_all.sort_values(["cik", "name", "year", "tag", "revenue_priority"])
        .drop_duplicates(subset=["cik", "name", "year", "tag"], keep="first")
    )

    financials = (
        deduped.pivot_table(
            index=["cik", "name", "year"],
            columns="tag",
            values="value",
            aggfunc="first",
        )
        .reset_index()
        .rename_axis(columns=None)
    )

    return financials


def main() -> None:
    financials = build_financials()

    output_path = PROCESSED_DATA_DIR / "financials_clean.csv"
    financials.to_csv(output_path, index=False)

    print(f"Done. Saved cleaned financials to: {output_path}")


if __name__ == "__main__":
    main()
