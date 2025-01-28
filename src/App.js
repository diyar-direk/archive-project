import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import People from "./pages/people/People";
import Profile from "./pages/people/Profile";
import AddPerson from "./pages/people/AddPerson";
import Countries from "./pages/addresses/Countries";
import Government from "./pages/addresses/Government";
import City from "./pages/addresses/City";
import Village from "./pages/addresses/Village";
import Region from "./pages/addresses/Region";
import Street from "./pages/addresses/Street";
import Sources from "./pages/Categories/Sources";
import Event from "./pages/Categories/Event";
import Party from "./pages/Categories/Party";
import LoginForm from "./pages/Login/LoginForm";
import Sections from "./pages/Categories/Sections";
import Informations from "./pages/info/Informations";
import AddInformation from "./pages/info/AddInformation";
import InfoPage from "./pages/info/InfoPage";
import AddCoordinates from "./pages/coordinates/AddCoordinates";
import Coordinates from "./pages/coordinates/Coordinates";
import UpdatePerson from "./pages/people/UpdatePerson";
import UpdateCoordinates from "./pages/coordinates/UpdateCordinates";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import UpdateInfo from "./pages/info/UpdateInfo";
import { useEffect } from "react";
import DashboardAuth from "./Auth/DashboardAuth";
import Refresh from "./Auth/Refresh";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      {/* <div className=" progres">
        <div className="relative">
          <h4>0%</h4>
          <span></span>
        </div>
      </div> */}

      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route element={<Refresh />}>
          <Route element={<DashboardAuth />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="users" element={<Users />} />
              <Route path="add_user" element={<AddUser />} />
              <Route path="people" element={<People />} />
              <Route path="people/:id" element={<Profile />} />
              <Route path="add_person" element={<AddPerson />} />
              <Route path="update_person/:id" element={<UpdatePerson />} />
              <Route path="countries" element={<Countries />} />
              <Route path="governments" element={<Government />} />
              <Route path="cities" element={<City />} />
              <Route path="villages" element={<Village />} />
              <Route path="regions" element={<Region />} />
              <Route path="streets" element={<Street />} />
              <Route path="sections" element={<Sections />} />
              <Route path="sources" element={<Sources />} />
              <Route path="event" element={<Event />} />
              <Route path="party" element={<Party />} />
              <Route path="informations" element={<Informations />} />
              <Route path="informations/:id" element={<InfoPage />} />
              <Route path="add_information" element={<AddInformation />} />
              <Route path="update_info/:id" element={<UpdateInfo />} />
              <Route path="coordinates" element={<Coordinates />} />
              <Route path="coordinates/:id" element={<UpdateCoordinates />} />
              <Route path="add_coordinates" element={<AddCoordinates />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
