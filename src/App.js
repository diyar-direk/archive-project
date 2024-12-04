import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/pepole/AddPerson";
import Login from "./pages/Login/Login";
import Log from "./pages/Login/log";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Dashboard />}>
          <Route path="add_person" element={<AddPerson />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="login2" element={<Log />} />
      </Routes>
    </div>
  );
}

export default App;
