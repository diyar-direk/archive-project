import { Route } from "react-router-dom";
import Countries from "./Countries";
import Government from "./Government";
import Counties from "./Counties";
import Village from "./Village";
import Region from "./Region";
import Street from "./Street";
import City from "./City";
const addressRouter = (
  <>
    <Route path="countries" element={<Countries />} />
    <Route path="governorates" element={<Government />} />
    <Route path="counties" element={<Counties />} />
    <Route path="cities" element={<City />} />
    <Route path="villages" element={<Village />} />
    <Route path="regions" element={<Region />} />
    <Route path="streets" element={<Street />} />
  </>
);
export default addressRouter;
