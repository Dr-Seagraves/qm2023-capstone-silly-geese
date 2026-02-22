import pandas as pd

# Load raw data
reports = pd.read_csv("data/raw/reports.csv")
clients = pd.read_csv("data/raw/clients.csv")

print("Reports shape:", reports.shape)
print("Clients shape:", clients.shape)
# Ensure boolean columns are treated correctly
reports["is_no_activity"] = reports["is_no_activity"].astype(str)
reports["is_amendment"] = reports["is_amendment"].astype(str)

# Keep only real activity reports
reports = reports[reports["is_no_activity"] == "False"]
reports = reports[reports["is_amendment"] == "False"]

print("After dropping no-activity and amendments:", reports.shape)
# Group by lob_id and filing_year
lobbying_year = (
    reports
    .groupby(["lob_id", "filing_year"])["amount"]
    .sum()
    .reset_index()
)

print("Lobbying firm-year shape:", lobbying_year.shape)
# Merge with clients to get gvkey
lobbying_year = lobbying_year.merge(
    clients[["lob_id", "gvkey"]],
    on="lob_id",
    how="left"
)

print("After merging gvkey:", lobbying_year.shape)
# Drop rows with missing gvkey
lobbying_year = lobbying_year.dropna(subset=["gvkey"])

print("After dropping missing gvkey:", lobbying_year.shape)
# Rename columns
lobbying_year = lobbying_year.rename(columns={
    "filing_year": "year",
    "amount": "lobbying_spend"
})

print(lobbying_year.head())
# Save cleaned dataset
lobbying_year.to_csv("data/processed/lobbying_clean.csv", index=False)

print("Saved to data/processed/lobbying_clean.csv")