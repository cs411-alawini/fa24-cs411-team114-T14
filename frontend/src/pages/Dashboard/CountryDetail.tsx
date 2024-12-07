import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import {
  FaUtensils,
  FaHospital,
  FaCloud,
  FaPlane,
  FaShieldAlt,
  FaDollarSign,
  FaTheaterMasks,
  FaRoad,
  FaStethoscope,
} from "react-icons/fa";
import formatLargeNumber from "../../utils/FormatLargeNumber";
import formatCurrency from "../../utils/FormatCurrency";
import formatPercentage from "../../utils/FormatPercentage";
import renderAverageRating from "./components/RenderAverageRating";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectCountryDetails,
  selectCountryDetailsError,
  selectCountryDetailsIsLoading,
} from "../../services/demographics/DemographicsSelectors";
import {
  fetchCountryDetails,
  resetCountryDetail,
} from "../../services/demographics/DemographicsSlice";

function CountryDetail() {
  const { name } = useParams<{ name: string }>();
  const data = useAppSelector(selectCountryDetails);
  const isLoading = useAppSelector(selectCountryDetailsIsLoading);
  const error = useAppSelector(selectCountryDetailsError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (name) {
      dispatch(fetchCountryDetails(name));
    }
    return () => {
      dispatch(resetCountryDetail());
    };
  }, [dispatch, name]);

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  if (isLoading || !data) {
    return (
      <Container
        className="mt-4 d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const { country, climate, economy, average_ratings } = data;

  return (
    <Container className="mt-4 mb-4">
      <h1 className="mb-4">{country.Name}</h1>

      {/* Demographics Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-primary text-white">
              Demographics
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Population:</strong>{" "}
                    {formatLargeNumber(country.Population)}
                  </p>
                  <p className="mb-1">
                    <strong>Capital City:</strong> {country.CapitalCity}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Largest City:</strong> {country.LargestCity}
                  </p>
                  <p className="mb-1">
                    <strong>Official Language:</strong>{" "}
                    {country.OfficialLanguage}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Climate Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-success text-white">
              Climate
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Agricultural Land (%):</strong>{" "}
                    {climate.AgriculturalLandPercent}%
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Forested Area (%):</strong>{" "}
                    {climate.ForestedAreaPercent}%
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>
                      CO<sub>2</sub> Emissions:
                    </strong>{" "}
                    {formatLargeNumber(Number.parseInt(climate.CO2Emissions))}{" "}
                    metric tons
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Economy Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-info text-white">
              Economy
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>GDP:</strong>{" "}
                    {formatCurrency(
                      Number.parseInt(economy.GDP),
                      economy.CurrencyCode
                    )}
                  </p>
                  <p className="mb-1">
                    <strong>CPI:</strong> {economy.CPI}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Currency Code:</strong> {economy.CurrencyCode}
                  </p>
                  <p className="mb-1">
                    <strong>Minimum Wage:</strong>{" "}
                    {formatCurrency(
                      Number.parseInt(economy.MinimumWage),
                      economy.CurrencyCode
                    )}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-1">
                    <strong>Unemployment Rate:</strong>{" "}
                    {formatPercentage(
                      Number.parseInt(economy.UnemploymentRate),
                      "0%"
                    )}
                  </p>
                  {/* Add other economy fields as needed */}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Ratings Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-warning text-white">
              User Ratings
            </Card.Header>
            <Card.Body>
              {renderAverageRating(
                "Food Rating",
                average_ratings.food_rating,
                <FaUtensils />
              )}
              {renderAverageRating(
                "Hospital Rating",
                average_ratings.hospital_rating,
                <FaHospital />
              )}
              {renderAverageRating(
                "Climate Rating",
                average_ratings.climate_rating,
                <FaCloud />
              )}
              {renderAverageRating(
                "Tourism Rating",
                average_ratings.tourism_rating,
                <FaPlane />
              )}
              {renderAverageRating(
                "Safety Rating",
                average_ratings.safety_rating,
                <FaShieldAlt />
              )}
              {renderAverageRating(
                "Cost of Living Rating",
                average_ratings.cost_of_living_rating,
                <FaDollarSign />
              )}
              {renderAverageRating(
                "Culture & Entertainment Rating",
                average_ratings.culture_entertainment_rating,
                <FaTheaterMasks />
              )}
              {renderAverageRating(
                "Infrastructure Rating",
                average_ratings.infrastructure_rating,
                <FaRoad />
              )}
              {renderAverageRating(
                "Healthcare Rating",
                average_ratings.healthcare_rating,
                <FaStethoscope />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CountryDetail;
