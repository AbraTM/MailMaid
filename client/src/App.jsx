import React from "react";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/home.jsx"
import GetStarted from "./pages/get-started.jsx";
import Emails from "./pages/emails.jsx";
import FinalizeDetails from "./pages/finalize-details.jsx";
import Footer from "./components/footer.jsx";
import './App.css';


const MainLayout = () => {
  return(
    <div>
      <Outlet />
      <Footer />
    </div>
  )
}

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="/get-started" element={<GetStarted />} />
    <Route path="/emails" element={<Emails />} />
    <Route path="/finalize-details" element={<FinalizeDetails />} />
  </Route>
))

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

