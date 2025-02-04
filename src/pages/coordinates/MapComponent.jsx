import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
const MapComponent = ({ lat, lng }) => {
  const customIcon = L.icon({
    iconUrl: require("./icons8-location-pin-48.png"),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} icon={customIcon} />
    </MapContainer>
  );
};

export default MapComponent;
