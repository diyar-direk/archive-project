import { Map, Marker, Overlay } from "pigeon-maps";
import { toPoint } from "mgrs";
import { useState } from "react";
import "./map.css";
import { Link } from "react-router-dom";

const provider = (x, y, z) => {
  return `http://localhost:8080/data/syria_0_16/${z}/${x}/${y}.png`;
};

const cleanMGRS = (str) => {
  return str.replace(/\s+/g, "").toUpperCase();
};

function MapTiles({ coords }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const points = coords
    .map((item) => {
      try {
        const cleaned = cleanMGRS(item.coordinates);
        const [lon, lat] = toPoint(cleaned);
        return {
          lat,
          lon,
          id: item._id,
          label: item.coordinates,
        };
      } catch {}
    })
    .filter(Boolean);

  const defaultCenter =
    points.length > 0 ? [points[0].lat, points[0].lon] : [34.8021, 38.9968];

  return (
    <div>
      <Map
        height={600}
        provider={provider}
        defaultZoom={7}
        maxZoom={16}
        minZoom={2}
        defaultCenter={defaultCenter}
      >
        {points.map((point, i) => (
          <Marker
            key={i}
            width={50}
            anchor={[point.lat, point.lon]}
            onClick={() => setSelectedIndex(i)}
          />
        ))}

        {selectedIndex !== null && points[selectedIndex] && (
          <Overlay
            anchor={[points[selectedIndex].lat, points[selectedIndex].lon]}
            offset={[0, -40]}
          >
            <div className="coord-locations">
              <i
                className="fa-solid fa-xmark"
                title="إغلاق"
                onClick={() => setSelectedIndex(null)}
              />
              <h4>📍{points[selectedIndex].label}</h4>

              {points[selectedIndex].id && (
                <Link to={`/coordinate/${points[selectedIndex].id}`}>
                  details
                </Link>
              )}
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
}

export default MapTiles;
