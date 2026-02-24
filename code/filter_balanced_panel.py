"""
Filter to companies with complete data for every year 2010-2020.
Saves a balanced panel to data/final/merged_financials_lobbying_balanced.csv
"""

import pandas as pd


def main():
    input_path = "/workspaces/qm2023-capstone-silly-geese/data/final/merged_financials_lobbying.csv"
    output_path = (
        "/workspaces/qm2023-capstone-silly-geese/data/final/"
        "merged_financials_lobbying_balanced.csv"
    )

    df = pd.read_csv(input_path)

    # Keep only firms with all years present in the window
    years = list(range(2010, 2021))
    required_years = set(years)

    firm_years = df.groupby("cik")["year"].apply(set)
    keep_firms = firm_years[firm_years.apply(lambda s: required_years.issubset(s))].index

    balanced = df[df["cik"].isin(keep_firms)].copy()

    balanced.to_csv(output_path, index=False)

    print(f"Input rows: {len(df)}")
    print(f"Balanced rows: {len(balanced)}")
    print(f"Firms kept: {balanced['cik'].nunique()}")
    print(f"Saved to: {output_path}")


if __name__ == "__main__":
    main()
