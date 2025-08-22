import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar/navbar";
import Dashboard from "./Dashboard/dashboard";
import Login from "./Page/login";
import Register from "./Page/register";
import Setting from "./Dashboard/setting"
import Users from "./Dashboard/usersTable"
import Home from "./Page/home"
import Reservation from "./Page/reservation"
import Reservationed from "./Page/reservationed"
import ReservationAdmin from "./Dashboard/reservationAdmin"

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");
  const [query, setQuery] = useState("");

  let routes;

  if (!isLoggedIn) {
    // Giriş yapmamış kullanıcı
    routes = (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  } else if (isAdmin) {
    // Admin kullanıcı
    routes = (
       <Routes>
          <Route path="/dashboard/*" element={<Dashboard query={query} setQuery={setQuery} />}>
            <Route path="users" element={<Users query={query} setQuery={setQuery} />} />
            <Route path="reservation" element={<ReservationAdmin />} />
            <Route path="setting" element={<Setting />} />
            <Route path="*" element={<Navigate to="/dashboard/users" replace />} />
          </Route>
            <Route path="*" element={<Navigate to="/dashboard/users" replace />} />
        </Routes>
    );
  } else {
    // Normal kullanıcı
    routes = (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservationed" element={<Reservationed />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    );
  }

  return (
    <BrowserRouter>
      <Navbar query={query} setQuery={setQuery} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} />
      {routes}
    </BrowserRouter>
  );
}
