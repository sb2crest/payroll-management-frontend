/* eslint-disable react-hooks/rules-of-hooks */
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./layouts/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Inbox from "./pages/Inbox.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";
import Timesheet from "./pages/Timesheet.jsx";
import AddConsignee from "./pages/AddConsignee.jsx";
import AddHour from "./pages/AddHour.jsx";
import Worksheet from "./pages/Worksheet.jsx";
import Login from "./pages/Login.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/theme-context.jsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/inbox",
        element: <Inbox />,
      },
      {
        path: "/timesheet",
        element: <Timesheet />,
      },
      {
        path: "/worksheet",
        element: <Worksheet />,
      },
      {
        path: "/add-consignee",
        element: <AddConsignee />,
      },
      {
        path: "/add-hour",
        element: <AddHour />,
      },
    ],
  },
  {
    path: "/login/:companyID",
    element: <Login />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // eslint-disable-next-line react/jsx-no-undef
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>
);
