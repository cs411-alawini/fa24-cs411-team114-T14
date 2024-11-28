interface UserInput {
  userInputID: number;
  userID: number;
  country: string;
  dateVisitedFrom: string;
  dateVisitedTo: string;
  foodRating: number;
  hospitalRating: number;
  climateRating: number;
  tourismRating: number;
  safetyRating: number;
  costOfLivingRating: number;
  cultureEntertainmentRating: number;
  infrastructureRating: number;
  healthcareRating: number;
  comments?: string;
}

export default UserInput;
