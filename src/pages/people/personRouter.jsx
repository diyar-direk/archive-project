import { Route } from "react-router-dom";
import People from "./People";
import Profile from "./Profile";
import AddPerson from "./AddPerson";
import UpdatePerson from "./UpdatePerson";

const personRouter = (
  <>
    <Route path="people" element={<People />} />
    <Route path="people/:id" element={<Profile />} />
    <Route path="add_person" element={<AddPerson />} />
    <Route path="update_person/:id" element={<UpdatePerson />} />
  </>
);

export default personRouter;
