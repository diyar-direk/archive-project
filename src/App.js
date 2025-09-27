import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./pages/Login/LoginForm";
import Informations from "./pages/info/Informations";
import AddInformation from "./pages/info/AddInformation";
import InfoPage from "./pages/info/InfoPage";
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import UpdateInfo from "./pages/info/UpdateInfo";
import { useEffect } from "react";
import DashboardAuth from "./Auth/DashboardAuth";
import Refresh from "./Auth/Refresh";
import AdminAuth from "./Auth/AdminAuth";
import Backup from "./pages/backup/Backup";
import PageNotFound from "./components/response/PageNotFound";
import AccessDenied from "./components/response/AccessDenied";
import ImageSearch from "./pages/people/ImageSearch";
import DashboardCharts from "./pages/status/InformationChart";
import ExportsDataShow from "./pages/exports/export/ExportsDataShow";
import AddExport from "./pages/exports/export/AddExport";
import UpdateExport from "./pages/exports/export/UpdateExport";
import ExportViewPage from "./pages/exports/export/ExportViewPage";
import ReportListShow from "./pages/exports/report/ReportListShow";
import AddReport from "./pages/exports/report/AddReport";
import UpdateReport from "./pages/exports/report/UpdateReport";
import ReportViewPage from "./pages/exports/report/ReportViewPage";
import ResultListShow from "./pages/exports/result/ResultListShow";
import AddResult from "./pages/exports/result/AddResut";
import UpdateResult from "./pages/exports/result/UpdateResult";
import ResultViewPage from "./pages/exports/result/ResultViewPage";
import CategoriesRouter from "./pages/Categories/CategoriesRouter";
import addressRouter from "./pages/addresses/addressRouter";
import personRouter from "./pages/people/personRouter";
import coordinatesRouter from "./pages/coordinates/coordinatesrouter";
import Recipients from "./pages/exports/Recipients";
import Chat from "./pages/chat/Chat";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
        <Route element={<Refresh />}>
          <Route element={<DashboardAuth />}>
            <Route path="/" element={<Dashboard />}>
              <Route path="*" element={<PageNotFound />} />
              <Route path="error-403" element={<AccessDenied />} />
              <Route element={<AdminAuth />}>
                <Route path="users" element={<Users />} />
                <Route path="add_user" element={<AddUser />} />
                <Route path="backup" element={<Backup />} />
                <Route path="recipients" element={<Recipients />} />
                <Route path="exports" element={<ExportsDataShow />} />
                <Route path="add_export" element={<AddExport />} />
                <Route path="exports/:id" element={<ExportViewPage />} />
                <Route path="update_export/:id" element={<UpdateExport />} />
                <Route path="reports" element={<ReportListShow />} />
                <Route path="add_report" element={<AddReport />} />
                <Route path="update_report/:id" element={<UpdateReport />} />
                <Route path="reports/:id" element={<ReportViewPage />} />
                <Route path="results" element={<ResultListShow />} />
                <Route path="add_result" element={<AddResult />} />
                <Route path="update_result/:id" element={<UpdateResult />} />
                <Route path="results/:id" element={<ResultViewPage />} />
              </Route>
              <Route path="/categories/*" element={<Outlet />}>
                {CategoriesRouter}
              </Route>
              <Route path="/addresses/*" element={<Outlet />}>
                {addressRouter}
              </Route>
              <Route path="/people/*" element={<Outlet />}>
                {personRouter}
              </Route>
              <Route path="/coordinates/*" element={<Outlet />}>
                {coordinatesRouter}
              </Route>
              <Route path="status" element={<DashboardCharts />} />
              <Route path="search_by_image" element={<ImageSearch />} />
              <Route path="informations" element={<Informations />} />
              <Route path="informations/:id" element={<InfoPage />} />
              <Route path="add_information" element={<AddInformation />} />
              <Route path="update_info/:id" element={<UpdateInfo />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
