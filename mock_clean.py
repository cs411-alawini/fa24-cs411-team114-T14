import pandas as pd
import random

df = pd.read_csv("MOCK_DATA.csv")
df_new = pd.DataFrame(
    columns=[
        "id",
        "username",
        "password",
        "email",
        "citizenship",
    ]
)
for i, row in df.iterrows():
    new_row = {
        "id": i,
        "username": row["username"],
        "password": row["password"],
        "email": row["email"],
        "citizenship": random.randrange(195),
    }
    df_new = pd.concat([df_new, pd.DataFrame([new_row])])
df_new.to_csv("MOCK_DATA_CLEAN.csv", index=False, header=False)
