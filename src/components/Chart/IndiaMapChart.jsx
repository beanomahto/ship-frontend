import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import indiaTopoJson from './india.topo.json';

const IndiaMapChart = () => {
  console.log(indiaTopoJson); // Verify the data is loaded correctly

  return (
    <div className="indiaMapCard">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1000 }}>
        <Geographies geography={indiaTopoJson}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#DDD"
                stroke="#FFF"
                style={{
                  default: { outline: 'none' },
                  hover: { fill: "#F53", outline: 'none' },
                  pressed: { fill: "#E42", outline: 'none' }
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default IndiaMapChart;
