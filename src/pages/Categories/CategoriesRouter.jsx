import { Route } from "react-router-dom";
import Field from "./Field";
import Sources from "./Sources";
import Event from "./Event";
import Party from "./Party";
import AdminAuth from "../../Auth/AdminAuth";
import Sections from "./Sections";
import Departments from "./Departments";

const CategoriesRouter = (
  <>
    <Route element={<AdminAuth />}>
      <Route path="sections" element={<Sections />} />
    </Route>
    <Route path="departments" element={<Departments />} />
    <Route path="fields" element={<Field />} />
    <Route path="sources" element={<Sources />} />
    <Route path="event" element={<Event />} />
    <Route path="party" element={<Party />} />
  </>
);

export default CategoriesRouter;
