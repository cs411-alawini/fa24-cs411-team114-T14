import { Card } from "react-bootstrap";
import LoginTabs from "./components/LoginTabs";
import { useEffect } from "react";
import { fetchCitizenships } from "../../services/country/CountrySlice";
import { useAppDispatch } from "../../app/hooks";

function Login(): JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCitizenships());
  });

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "90vh", maxWidth: "500px" }}
    >
      <Card>
        <Card.Body>
          <h2 className="h2 mb-4">Country data tracker</h2>
          <h4 className="h4 mb-4">Login into your application account</h4>
          <LoginTabs />
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
