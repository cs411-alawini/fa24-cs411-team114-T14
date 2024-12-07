import { useEffect, useState } from "react";
import { Form, FormControl, Dropdown } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectSearchLocationResults } from "../../../services/searchLocation/SearchLocationSelectors";
import {
  clearCache,
  fetchSearchResults,
} from "../../../services/searchLocation/SearchLocationSlice";
import { useNavigate } from "react-router";
import { dashboardCountryDetail } from "../../../routes";

const SearchLocation = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownItems = useAppSelector(selectSearchLocationResults);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearCache());
    };
  }, [dispatch]);

  const handleSearchChange = (event: any) => {
    const term: string = event.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      dispatch(fetchSearchResults(term));
    }
  };

  return (
    <div style={{ width: "600px", margin: "20px auto", position: "relative" }}>
      <Form>
        <FormControl
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Form>
      {searchTerm && (
        <Dropdown.Menu
          show
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: "3px",
          }}
        >
          {dropdownItems.length > 0 ? (
            dropdownItems.map((item, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  navigate(
                    `${dashboardCountryDetail}/${encodeURIComponent(
                      item.countryName
                    )}`
                  );
                }}
              >
                {[
                  item.countryName,
                  item.abbreviation,
                  item.capitalCity,
                  item.largestCity,
                ]
                  .filter(Boolean)
                  .join(" - ")}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No results found</Dropdown.Item>
          )}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default SearchLocation;
