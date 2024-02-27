import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Npb from "./Pages/Npb";
import Ps from "./Pages/Ps";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex flex-row">
      <Router>
        <Sidebar className="flex-grow" /> {/* Added flex-grow class */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="/npb" element={<Npb />} />
          <Route path="/npb/:id" element={<Npb />} /> {/* Handle dynamic IDs */}
          <Route path="/ps" element={<Ps />} />
          <Route path="/ps/:id" element={<Ps />} /> {/* Handle dynamic IDs */}
          <Route path="/log" element={<Npb />} />
          <Route path="/settings" element={<Ps />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
