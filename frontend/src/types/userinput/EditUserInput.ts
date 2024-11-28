interface EditUserInput {
  userInputID: number;
  country: number;
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

export default EditUserInput;
