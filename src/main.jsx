/* eslint-disable react-hooks/rules-of-hooks */
import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";
import Layout from "./layouts/Layout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/theme-context.jsx";
import axios from "axios";
import { AuthProvider } from "./context/auth-context.jsx";
import MainDashboard from "./components/MainDashboard.jsx";
import Loading from "./components/Loading.jsx";

// Lazy load pages
const Inbox = lazy(() => import("./pages/Inbox.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Timesheet = lazy(() => import("./pages/Timesheet.jsx"));
const AddConsignee = lazy(() => import("./pages/AddConsignee.jsx"));
const AddHours = lazy(() => import("./pages/AddHours.jsx"));
const Worksheet = lazy(() => import("./pages/Worksheet.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Table = lazy(() => import("./pages/Table.jsx"));

axios.defaults.baseURL = "http://localhost:8086/api";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <MainDashboard />,
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "/inbox",
        element: (
          <Suspense fallback={<Loading />}>
            <Inbox />
          </Suspense>
        ),
      },
      {
        path: "/timesheet",
        element: (
          <Suspense fallback={<Loading />}>
            <Timesheet />
          </Suspense>
        ),
      },
      {
        path: "/worksheet",
        element: (
          <Suspense fallback={<Loading />}>
            <Worksheet />
          </Suspense>
        ),
      },
      {
        path: "/add-consignee",
        element: (
          <Suspense fallback={<Loading />}>
            <AddConsignee />
          </Suspense>
        ),
      },
      {
        path: "/add-hours",
        element: (
          <Suspense fallback={<Loading />}>
            <AddHours />
          </Suspense>
        ),
      },
      {
        path: "/table",
        element: (
          <Suspense fallback={<Loading />}>
            <Table />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login/:companyID",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </AuthProvider>
);
