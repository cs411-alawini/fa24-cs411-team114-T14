import pandas as pd

df = pd.read_csv("world-data-2023.csv")
df_new = pd.DataFrame(
    columns=[
        "countryid",
        "name",
        "abbreviation",
        "landareakm2",
        "densityperkm2",
        "population",
        "capitalcity",
        "largestcity",
        "officiallanguage",
        "laborforceparticipationpercent",
        "birthrate",
        "fertilityrate",
        "infantmortality",
        "lifeexpectancy",
        "maternalmortality",
        "urbanpopulationpercent",
        "physicianperthousand",
        "armedforcesize",
        "latitude",
        "longitude",
        "callingcode",
    ]
)
df_climate = pd.DataFrame(
    columns=[
        "countryid",
        "agriculturallandpercent",
        "forestareapercent",
        "co2emissions",
    ]
)
df_economy = pd.DataFrame(
    columns=[
        "countryid",
        "gdp",
        "cpi",
        "cpichangepercent",
        "currencycode",
        "minimumwage",
        "unemploymentrate",
        "taxrevenuepercent",
        "totaltaxrate",
        "gasolineprice",
        "outofpocketpercent",
        "grossprimaryeducationpercent",
        "grosssecondaryeducationpercent",
    ]
)
print(df.columns)
print(df.head())
for i, row in df.iterrows():
    print(row)
    landarea = row["Land Area(Km2)"]
    if type(landarea) == str:
        landarea = float(landarea.replace(",", ""))
    density = row["Density (P/Km2)"]
    if type(density) == str:
        density = float(density.replace(",", ""))
    population = row["Population"]
    if type(population) == str:
        population = int(population.replace(",", ""))
    labor_force_percentage = row["Population: Labor force participation (%)"]
    if type(labor_force_percentage) == str:
        labor_force_percentage = float(labor_force_percentage.replace("%", ""))
    birth_rate = row["Birth Rate"]
    if type(birth_rate) == str:
        birth_rate = float(birth_rate)
    fertility_rate = row["Fertility Rate"]
    if type(fertility_rate) == str:
        fertility_rate = float(fertility_rate)
    infant_mortality = row["Infant mortality"]
    if type(infant_mortality) == str:
        infant_mortality = float(infant_mortality)
    life_expectancy = row["Life expectancy"]
    if type(life_expectancy) == str:
        life_expectancy = float(life_expectancy)
    maternal_mortality = row["Maternal mortality ratio"]
    if type(maternal_mortality) == str:
        maternal_mortality = float(maternal_mortality)
    urban_population = row["Urban_population"]
    if type(urban_population) == str:
        urban_population = float(urban_population.replace(",", ""))
    physician_per_thousand = row["Physicians per thousand"]
    if type(physician_per_thousand) == str:
        physician_per_thousand = float(physician_per_thousand)
    armed_force_size = row["Armed Forces size"]
    if type(armed_force_size) == str:
        armed_force_size = int(armed_force_size.replace(",", ""))
    calling_code = row["Calling Code"]
    if type(calling_code) == str:
        calling_code = calling_code.replace(" ", "")
    new_row = {
        "countryid": i,
        "name": row["Country"],
        "abbreviation": row["Abbreviation"],
        "landareakm2": landarea,
        "densityperkm2": density,
        "population": population,
        "capitalcity": row["Capital/Major City"],
        "largestcity": row["Largest city"],
        "officiallanguage": row["Official language"],
        "laborforceparticipationpercent": labor_force_percentage,
        "birthrate": birth_rate,
        "fertilityrate": fertility_rate,
        "infantmortality": infant_mortality,
        "lifeexpectancy": life_expectancy,
        "maternalmortality": maternal_mortality,
        "urbanpopulationpercent": urban_population / population * 100,
        "physicianperthousand": physician_per_thousand,
        "armedforcesize": armed_force_size,
        "latitude": float(row["Latitude"]),
        "longitude": float(row["Longitude"]),
        "callingcode": calling_code,
    }
    new_record = pd.DataFrame([new_row])
    df_new = pd.concat([df_new, new_record])
    agriland = row["Agricultural Land( %)"]
    if type(agriland) == str:
        agriland = float(agriland.replace("%", ""))
    forestarea = row["Forested Area (%)"]
    if type(forestarea) == str:
        forestarea = float(forestarea.replace("%", ""))
    co2emissions = row["Co2-Emissions"]
    if type(co2emissions) == str:
        co2emissions = float(co2emissions.replace(",", ""))
    new_climate_row = {
        "countryid": i,
        "agriculturallandpercent": agriland,
        "forestareapercent": forestarea,
        "co2emissions": co2emissions,
    }
    df_climate = pd.concat([df_climate, pd.DataFrame([new_climate_row])])
    gdp = row["GDP"]
    if type(gdp) == str:
        gdp = float(gdp.replace(",", "").replace("$", ""))
    cpi = row["CPI"]
    if type(cpi) == str:
        cpi = float(cpi.replace(",", ""))
    cpi_change_percent = row["CPI Change (%)"]
    if type(cpi_change_percent) == str:
        cpi_change_percent = float(cpi_change_percent.replace("%", ""))
    minimum_wage = row["Minimum wage"]
    if type(minimum_wage) == str:
        minimum_wage = float(minimum_wage.replace("$", "").replace(",", ""))
    unemployment_rate = row["Unemployment rate"]
    if type(unemployment_rate) == str:
        unemployment_rate = float(unemployment_rate.replace("%", ""))
    tax_revenue_percent = row["Tax revenue (%)"]
    if type(tax_revenue_percent) == str:
        tax_revenue_percent = float(tax_revenue_percent.replace("%", ""))
    total_tax_rate = row["Total tax rate"]
    if type(total_tax_rate) == str:
        total_tax_rate = float(total_tax_rate.replace("%", ""))
    gasoline_price = row["Gasoline Price"]
    if type(gasoline_price) == str:
        gasoline_price = float(gasoline_price.replace("$", ""))
    out_of_pocket_percent = row["Out of pocket health expenditure"]
    if type(out_of_pocket_percent) == str:
        out_of_pocket_percent = float(out_of_pocket_percent.replace("%", ""))
    gross_primary_education_percent = row["Gross primary education enrollment (%)"]
    if type(gross_primary_education_percent) == str:
        gross_primary_education_percent = float(
            gross_primary_education_percent.replace("%", "")
        )
    gross_secondary_education_percent = row["Gross tertiary education enrollment (%)"]
    if type(gross_secondary_education_percent) == str:
        gross_secondary_education_percent = float(
            gross_secondary_education_percent.replace("%", "")
        )
    new_economy_row = {
        "countryid": i,
        "gdp": gdp,
        "cpi": cpi,
        "cpichangepercent": cpi_change_percent,
        "currencycode": row["Currency-Code"],
        "minimumwage": minimum_wage,
        "unemploymentrate": unemployment_rate,
        "taxrevenuepercent": tax_revenue_percent,
        "totaltaxrate": total_tax_rate,
        "gasolineprice": gasoline_price,
        "outofpocketpercent": out_of_pocket_percent,
        "grossprimaryeducationpercent": gross_primary_education_percent,
        "grosssecondaryeducationpercent": gross_secondary_education_percent,
    }
    df_economy = pd.concat([df_economy, pd.DataFrame([new_economy_row])])
print(df_new.head())
print(df_climate.head())
print(df_economy.head())
df_new.to_csv("world-data-2023-clean.csv", index=False, header=False)
df_climate.to_csv("world-data-2023-climate.csv", index=False, header=False)
df_economy.to_csv("world-data-2023-economy.csv", index=False, header=False)
