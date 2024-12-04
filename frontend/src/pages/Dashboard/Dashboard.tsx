import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

function Dashboard() {
  return (
    <div style={{ height: "auto", maxHeight: "93vh", padding: "10px" }}>
      <ComposableMap projectionConfig={{ scale: 150 }} height={385} width={800}>
        <Graticule stroke="#F53" />
        <Geographies geography={geoUrl}>
          {function ({ geographies }) {
            return geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#D6D6DA",
                    outline: "none",
                  },
                  hover: {
                    fill: "#F53",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none",
                  },
                }}
                data-tooltip-id="my-tooltip"
                data-tooltip-content={geo.properties.name}
              />
            ));
          }}
        </Geographies>
      </ComposableMap>
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default Dashboard;
