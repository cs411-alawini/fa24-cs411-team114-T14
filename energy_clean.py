import pandas as pd

df = pd.read_csv("world-data-2023.csv")
print(df["Country"])
energy_df = pd.read_csv("energy.csv")
print(energy_df.head())
df_energy_new = pd.DataFrame(
    columns=[
        "countryid",
        "energytype",
        "energyconsumption",
        "energyproduction",
    ]
)

mapping = {
    "Ivory Coast": "Côte d'Ivoire",
    "Cape Verde": "Cabo Verde",
    "Republic of the Congo": "Congo-Brazzaville",
    "Democratic Republic of the Congo": "Congo-Kinshasa",
    "The Gambia": "Gambia, The",
    "Republic of Ireland": "Ireland",
    "Federated States of Micronesia": "Micronesia",
    "Myanmar": "Burma",
    "Palestinian National Authority": "Palestinian Territories",
    "Saint Vincent and the Grenadines": "Saint Vincent/Grenadines",
    "East Timor": "Timor-Leste",
}

for i, row in df.iterrows():
    country = row["Country"]
    country_energy = energy_df[
        (energy_df["Country"] == country) & (energy_df["Year"] == 2019)
    ]
    if len(country_energy) == 0 and country in mapping:
        country = mapping[country]
        country_energy = energy_df[
            (energy_df["Country"] == country) & (energy_df["Year"] == 2019)
        ]
    for j, row_energy in country_energy.iterrows():
        new_row = {
            "countryid": i,
            "energytype": row_energy["Energy_type"],
            "energyconsumption": row_energy["Energy_consumption"],
            "energyproduction": row_energy["Energy_production"],
        }
        df_energy_new = pd.concat([df_energy_new, pd.DataFrame([new_row])])

print(df_energy_new.head())
df_energy_new.to_csv("energy_clean.csv", index=False, header=False)
