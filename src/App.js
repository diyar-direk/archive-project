import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddPerson from "./pages/pepole/AddPerson";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Dashboard />}>
          <Route path="add_person" element={<AddPerson />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
