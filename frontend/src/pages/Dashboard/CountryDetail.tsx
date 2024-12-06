import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

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

interface CountryDetailResponse {
  country: CountryData;
  climate: ClimateData;
  economy: EconomyData;
}

function CountryDetail() {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<CountryDetailResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/country/${name}`);
        if (!response.ok) {
          throw new Error("Failed to fetch country details");
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (name) {
      fetchCountryDetails();
    }
  }, [name]);

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

  const { country, climate, economy } = data;

  return (
    <Container className="mt-4 mb-4">
      <h1 className="mb-4">{country.Name}</h1>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-primary text-white">
              Demographics
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-1"><strong>Population:</strong> {country.Population}</p>
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

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-success text-white">
              Climate
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-1"><strong>Agricultural Land (%):</strong> {climate.AgriculturalLandPercent}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Forested Area (%):</strong> {climate.ForestedAreaPercent}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>CO2 Emissions:</strong> {climate.CO2Emissions}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h2" className="bg-info text-white">
              Economy
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-1"><strong>GDP:</strong> {economy.GDP}</p>
                  <p className="mb-1"><strong>CPI:</strong> {economy.CPI}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Currency Code:</strong> {economy.CurrencyCode}</p>
                  <p className="mb-1"><strong>Minimum Wage:</strong> {economy.MinimumWage}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-1"><strong>Unemployment Rate:</strong> {economy.UnemploymentRate}%</p>
                  {/* Add other economy fields as needed */}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CountryDetail;
