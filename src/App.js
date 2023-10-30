import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Pages/Home";
import Npb from "./Pages/Npb";
import Ps from "./Pages/Ps";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex flex-row min-h-full h-screen min-w-[350px]">
    <Router>
      <Sidebar />
      <Routes>
          <Route index element={<Home />} />
          <Route path="/log" element={<Npb/>} />
          <Route path="/settings" element={<Ps/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
