import { Map, Marker } from "pigeon-maps";
import { toPoint } from "mgrs"; // Import the MGRS conversion library

const provider = (x, y, z) => {
  return `http://localhost:8080/data/syria_0_16/${z}/${x}/${y}.png`;
};

function MapTiles(props) {
  let lat, lon;
  const loadCoords = () => {
    try {
      // Example MGRS coordinates
      const mgrsCoords = props.coords || "11D FB 2321 1000"; // Replace this with your dynamic prop

      // Convert MGRS to latitude and longitude
      const latLon = toPoint(mgrsCoords);
      console.log(latLon);
      lat = latLon[0];
      lon = latLon[1];

      console.log(`Converted MGRS: ${mgrsCoords} -> Lat: ${lat}, Lon: ${lon}`);
    } catch (error) {
      console.error("Error converting MGRS to lat/lon:", error);
    }
  };
  loadCoords();

  return (
    <div>
      <Map
        height={600}
        provider={provider}
        defaultZoom={7}
        maxZoom={16}
        minZoom={2}
        defaultCenter={[34.8021, 38.9968]} // You can change this to the center of the map
      >
        {/* Add a marker to the map at the converted lat/lon */}
        <Marker width={50} anchor={[lat, lon]} />
      </Map>
    </div>
  );
}

export default MapTiles;
