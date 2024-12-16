import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/people/AddPerson";
import Login from "./pages/login/Login";
import People from "./pages/people/People";
import Profile from "./pages/people/Profile";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<Login />} />

        <Route path="*" element={<Dashboard />}>
          <Route path="people" element={<People />} />
          <Route path="people/:id" element={<Profile />} />
          <Route path="add_person" element={<AddPerson />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
