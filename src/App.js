import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Dashboard />}></Route>
      </Routes>
    </div>
  );
}

export default App;
