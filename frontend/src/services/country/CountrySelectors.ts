import { RootState } from "../../app/store";

const selectCitizenships = (state: RootState) => state.country.citizenships;

export { selectCitizenships };
