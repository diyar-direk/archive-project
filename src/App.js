import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/pepole/AddPerson";
import Login from "./pages/login/login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Dashboard />}>
          <Route path="add_person" element={<AddPerson />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
