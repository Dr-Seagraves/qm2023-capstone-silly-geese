"""
Create a line chart comparing average lobbying expenditures to average revenues over time.
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load merged dataset
merged = pd.read_csv('/workspaces/qm2023-capstone-silly-geese/data/final/merged_financials_lobbying.csv')
crosswalk = pd.read_csv('/workspaces/qm2023-capstone-silly-geese/data/processed/cik_gvkey_crosswalk.csv')

print("Dataset shape:", merged.shape)
print("Columns:", merged.columns.tolist())

# Filter to only matched companies (those in the crosswalk)
matched_ciks = set(crosswalk['cik'].unique())
merged_matched = merged[merged['cik'].isin(matched_ciks)].copy()

print(f"\nTotal records: {len(merged)}")
print(f"Records from matched companies: {len(merged_matched)}")
print(f"Matched unique companies: {len(matched_ciks)}")

# Find companies that appear in all years (2010-2020)
company_years = merged_matched.groupby('cik')['year'].nunique()
companies_all_years = company_years[company_years == 11].index.tolist()
merged_consistent = merged_matched[merged_matched['cik'].isin(companies_all_years)].copy()

print(f"\nCompanies with data in all 11 years: {len(companies_all_years)}")
print(f"Records from consistent companies: {len(merged_consistent)}")

print("\nData summary (consistent companies only):")
print(merged_consistent[['year', 'Revenues', 'lobbying_spend']].describe())

# Calculate averages by year
yearly_stats = merged_consistent.groupby('year').agg({
    'Revenues': 'mean',
    'lobbying_spend': 'mean'
}).reset_index()

print("\nYearly averages:")
print(yearly_stats)

# Create figure with dual axes (since scales are very different)
fig, ax1 = plt.subplots(figsize=(12, 6))

# Plot Revenues on left axis
color = 'tab:blue'
ax1.set_xlabel('Year', fontsize=12)
ax1.set_ylabel('Average Revenue ($)', color=color, fontsize=12)
line1 = ax1.plot(yearly_stats['year'], yearly_stats['Revenues'], 
                 color=color, marker='o', linewidth=2, label='Average Revenue')
ax1.tick_params(axis='y', labelcolor=color)
ax1.grid(True, alpha=0.3)

# Create second y-axis for lobbying spend
ax2 = ax1.twinx()
color = 'tab:red'
ax2.set_ylabel('Average Lobbying Spend ($)', color=color, fontsize=12)
line2 = ax2.plot(yearly_stats['year'], yearly_stats['lobbying_spend'], 
                 color=color, marker='s', linewidth=2, label='Average Lobbying Spend')
ax2.tick_params(axis='y', labelcolor=color)

# Title and legend
plt.title('Average Lobbying Expenditures vs. Revenues Over Time\n(215 Matched Companies with Consistent Data 2010-2020)', 
          fontsize=14, fontweight='bold')

# Combine legends from both axes
lines = line1 + line2
labels = [l.get_label() for l in lines]
ax1.legend(lines, labels, loc='upper left', fontsize=10)

fig.tight_layout()
plt.savefig('/workspaces/qm2023-capstone-silly-geese/results/figures/lobbying_vs_revenue_line_chart.png', 
            dpi=300, bbox_inches='tight')
print(f"\n✓ Saved chart to: results/figures/lobbying_vs_revenue_line_chart.png")
plt.close()

print("\n✓ Chart created successfully!")
