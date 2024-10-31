import pandas as pd
import random

df = pd.DataFrame(
    columns=[
        "UserInputID",
        "UserID",
        "CountryID",
        "DateVisitedFrom",
        "DateVisitedTo",
        "FoodRating",
        "HospitalRating",
        "ClimateRating",
        "TourismRating",
        "SafetyRating",
        "CostOfLivingRating",
        "CultureEntertainmentRating",
        "InfrastructureRating",
        "HealthcareRating",
        "Comments",
    ]
)

for i in range(1500):
    new_row = {
        "UserInputID": i,
        "UserID": random.randrange(1000),
        "CountryID": random.randrange(195),
        "DateVisitedFrom": f"{random.randrange(2011, 2016)}-01-01",
        "DateVisitedTo": f"{random.randrange(2017, 2025)}-01-15",
        "FoodRating": random.randrange(1, 11),
        "HospitalRating": random.randrange(1, 11),
        "ClimateRating": random.randrange(1, 11),
        "TourismRating": random.randrange(1, 11),
        "SafetyRating": random.randrange(1, 11),
        "CostOfLivingRating": random.randrange(1, 11),
        "CultureEntertainmentRating": random.randrange(1, 11),
        "InfrastructureRating": random.randrange(1, 11),
        "HealthcareRating": random.randrange(1, 11),
        "Comments": "Great place to visit!",
    }
    df = pd.concat([df, pd.DataFrame([new_row])])
df.to_csv("userinput.csv", index=False, header=False)
