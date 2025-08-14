import { Route } from "react-router-dom";
import Coordinates from "./Coordinates";
import CoordinatesMap from "./CoordinatesMap";
import CoordPage from "./CoordPage";
import UpdateCoordinates from "./UpdateCordinates";
import AddCoordinates from "./AddCoordinates";

const coordinatesRouter = (
  <>
    <Route path="coordinates" element={<Coordinates />} />
    <Route path="coordinates_map" element={<CoordinatesMap />} />
    <Route path="coordinate/:id" element={<CoordPage />} />
    <Route path="coordinates/:id" element={<UpdateCoordinates />} />
    <Route path="add_coordinates" element={<AddCoordinates />} />
  </>
);
export default coordinatesRouter;
