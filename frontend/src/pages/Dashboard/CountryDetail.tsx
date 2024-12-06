// CountryDetail.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { FaUtensils, FaHospital, FaCloud, FaPlane, FaShieldAlt, FaDollarSign, FaTheaterMasks, FaRoad, FaStethoscope } from "react-icons/fa";

interface CountryData {
  Name: string;
  Population: number;
  CapitalCity: string;
  LargestCity: string;
  OfficialLanguage: string;
}

interface ClimateData {
  AgriculturalLandPercent: number;
  ForestedAreaPercent: number;
  CO2Emissions: number;
}

interface EconomyData {
  GDP: number;
  CPI: number;
  CurrencyCode: string;
  MinimumWage: number;
  UnemploymentRate: number;
  // ... add the rest
}

interface AverageRatings {
  food_rating: number | null;
  hospital_rating: number | null;
  climate_rating: number | null;
  tourism_rating: number | null;
  safety_rating: number | null;
  cost_of_living_rating: number | null;
  culture_entertainment_rating: number | null;
  infrastructure_rating: number | null;
  healthcare_rating: number | null;
}

interface CountryDetailResponse {
  country: CountryData;
  climate: ClimateData;
  economy: EconomyData;
  average_ratings: AverageRatings;
}

function CountryDetail() {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<CountryDetailResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/country/${encodeURIComponent(name || '')}`);
        if (!response.ok) {
          throw new Error("Failed to fetch country details");
        }
        const result: CountryDetailResponse = await response.json();
        console.log("Fetched Country Details:", result); // Debugging
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (name) {
      fetchCountryDetails();
    }
  }, [name]);

  // Helper functions
  const formatCurrency = (value: number | null | undefined, currencyCode: string): string => {
    if (typeof value !== 'number') {
      return '--';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number | null | undefined): string => {
    if (typeof value !== 'number') {
      return '--';
    }
    if (value >= 1.0e+12) {
      return (value / 1.0e+12).toFixed(2) + "T";
    }
    if (value >= 1.0e+9) {
      return (value / 1.0e+9).toFixed(2) + "B";
    }
    if (value >= 1.0e+6) {
      return (value / 1.0e+6).toFixed(2) + "M";
    }
    if (value >= 1.0e+3) {
      return (value / 1.0e+3).toFixed(2) + "K";
    }
    return value.toString();
  };

  const formatPercentage = (value: number | null | undefined, defaultValue: string = '--'): string => {
    if (typeof value !== 'number') {
      return defaultValue;
    }
    return `${value.toFixed(2)}%`;
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  if (!data) {
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
  console.log("Average Ratings:", average_ratings); // Debugging

  // Function to render average rating with progress bar and icon
  const renderAverageRating = (
    label: string,
    value: number | null,
    icon: JSX.Element
  ) => {
    if (value === null || typeof value !== 'number') {
      return (
        <p className="mb-1 d-flex align-items-center">
          <span className="me-2">{icon}</span>
          <strong>{label}:</strong> --
        </p>
      );
    }

    return (
      <div className="mb-3 d-flex align-items-center">
        <div className="me-2">
          {icon}
        </div>
        <div className="flex-grow-1">
          <strong>{label}:</strong>
          <ProgressBar
            now={value * 10} // Assuming ratings are out of 10
            label={`${value}/10`}
            variant={value >= 8 ? "success" : value >= 5 ? "warning" : "danger"}
            className="mt-1"
          />
        </div>
      </div>
    );
  };

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
                  <p className="mb-1"><strong>Population:</strong> {formatLargeNumber(country.Population)}</p>
                  <p className="mb-1"><strong>Capital City:</strong> {country.CapitalCity}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Largest City:</strong> {country.LargestCity}</p>
                  <p className="mb-1"><strong>Official Language:</strong> {country.OfficialLanguage}</p>
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
                  <p className="mb-1"><strong>Agricultural Land (%):</strong> {climate.AgriculturalLandPercent}%</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Forested Area (%):</strong> {climate.ForestedAreaPercent}%</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>CO<sub>2</sub> Emissions:</strong> {formatLargeNumber(climate.CO2Emissions)} metric tons</p>
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
                  <p className="mb-1"><strong>GDP:</strong> {formatCurrency(economy.GDP, economy.CurrencyCode)}</p>
                  <p className="mb-1"><strong>CPI:</strong> {economy.CPI}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Currency Code:</strong> {economy.CurrencyCode}</p>
                  <p className="mb-1"><strong>Minimum Wage:</strong> {formatCurrency(economy.MinimumWage, economy.CurrencyCode)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Unemployment Rate:</strong> {formatPercentage(economy.UnemploymentRate, '0%')}</p>
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
              {renderAverageRating("Food Rating", average_ratings.food_rating, <FaUtensils />)}
              {renderAverageRating("Hospital Rating", average_ratings.hospital_rating, <FaHospital />)}
              {renderAverageRating("Climate Rating", average_ratings.climate_rating, <FaCloud />)}
              {renderAverageRating("Tourism Rating", average_ratings.tourism_rating, <FaPlane />)}
              {renderAverageRating("Safety Rating", average_ratings.safety_rating, <FaShieldAlt />)}
              {renderAverageRating("Cost of Living Rating", average_ratings.cost_of_living_rating, <FaDollarSign />)}
              {renderAverageRating("Culture & Entertainment Rating", average_ratings.culture_entertainment_rating, <FaTheaterMasks />)}
              {renderAverageRating("Infrastructure Rating", average_ratings.infrastructure_rating, <FaRoad />)}
              {renderAverageRating("Healthcare Rating", average_ratings.healthcare_rating, <FaStethoscope />)}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CountryDetail;

