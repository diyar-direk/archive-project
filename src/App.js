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
import AdminAuth from "./Auth/AdminAuth";
import Backup from "./pages/backup/Backup";
import PageNotFound from "./components/response/PageNotFound";
import CoordPage from "./pages/coordinates/CoordPage";
import AccessDenied from "./components/response/AccessDenied";
import ImageSearch from "./pages/people/ImageSearch";
import Field from "./pages/Categories/Field";
import Counties from "./pages/addresses/Counties";
import DashboardCharts from "./pages/status/InformationChart";
import ExportsDataShow from "./pages/exports/ExportsDataShow";
import AddExport from "./pages/exports/AddExport";
import UpdateExport from "./pages/exports/UpdateExport";

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
        <Route element={<Refresh />}>
          <Route element={<DashboardAuth />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="*" element={<PageNotFound />} />
              <Route path="error-403" element={<AccessDenied />} />
              <Route element={<AdminAuth />}>
                <Route path="users" element={<Users />} />
                <Route path="add_user" element={<AddUser />} />
                <Route path="backup" element={<Backup />} />
                <Route path="status" element={<DashboardCharts />} />
                <Route path="exports" element={<ExportsDataShow />} />
                <Route path="add_export" element={<AddExport />} />
                <Route path="update_export/:id" element={<UpdateExport />} />
              </Route>

              <Route path="people" element={<People />} />
              <Route path="people/:id" element={<Profile />} />
              <Route path="search_by_image" element={<ImageSearch />} />
              <Route path="add_person" element={<AddPerson />} />
              <Route path="update_person/:id" element={<UpdatePerson />} />
              <Route path="countries" element={<Countries />} />
              <Route path="governorates" element={<Government />} />
              <Route path="counties" element={<Counties />} />
              <Route path="cities" element={<City />} />
              <Route path="villages" element={<Village />} />
              <Route path="regions" element={<Region />} />
              <Route path="streets" element={<Street />} />
              <Route path="sections" element={<Sections />} />
              <Route path="fields" element={<Field />} />
              <Route path="sources" element={<Sources />} />
              <Route path="event" element={<Event />} />
              <Route path="party" element={<Party />} />
              <Route path="informations" element={<Informations />} />
              <Route path="informations/:id" element={<InfoPage />} />
              <Route path="add_information" element={<AddInformation />} />
              <Route path="update_info/:id" element={<UpdateInfo />} />
              <Route path="coordinates" element={<Coordinates />} />
              <Route path="coordinate/:id" element={<CoordPage />} />
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
