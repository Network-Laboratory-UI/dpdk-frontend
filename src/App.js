import Home from "./Pages/Home";
import Npb from "./Pages/Npb";
import Ps from "./Pages/Ps";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";


const router = createBrowserRouter([
  {
    path: "",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "npb",
        element: <Npb />,
      },
      {
        path: "ps",
        element: <Ps />,
      }
    ],
  },
 
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
