import { Map, Marker, Overlay } from "pigeon-maps";
import { toPoint } from "mgrs";
import { useState } from "react";
import "./map.css";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import LocationIcon from "./location-icon.png";
const provider = (x, y, z) => {
  return `http://192.19.19.150:8080/data/syria_0_16/${z}/${x}/${y}.png`;
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
  const { language } = useLanguage();
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
          <Marker anchor={[point.lat, point.lon]}>
            <div
              onClick={() => setSelectedIndex(i)}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
            >
              <img
                alt=""
                src={LocationIcon}
                style={{ width: "40px", height: "40px" }}
              />
            </div>
          </Marker>
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
                  {language?.exports?.details}
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
