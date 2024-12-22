import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/people/AddPerson";
import Login from "./pages/Login/Login";
import People from "./pages/people/People";
import Profile from "./pages/people/Profile";
import Countries from "./pages/addresses/Countries";
import Government from "./pages/addresses/Government";
import City from "./pages/addresses/City";
import Village from "./pages/addresses/Village";
import Region from "./pages/addresses/Region";
import Street from "./pages/addresses/Street";
import { useEffect } from "react";
import axios from "axios";
import { baseURL } from "./context/context";

function App() {
  useEffect(() => {
    axios
      .get(`${baseURL}/people`)
      .then((res) => console.log(res.data.people[0]));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Dashboard />}>
          <Route path="people" element={<People />} />
          <Route path="people/:id" element={<Profile />} />
          <Route path="add_person" element={<AddPerson />} />
          <Route path="countries" element={<Countries />} />
          <Route path="governments" element={<Government />} />
          <Route path="cities" element={<City />} />
          <Route path="villages" element={<Village />} />
          <Route path="regions" element={<Region />} />
          <Route path="streets" element={<Street />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
