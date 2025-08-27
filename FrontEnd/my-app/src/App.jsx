import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import LogIn from "./Pages/Login/Login";
import "./App.css";
import SignUp from "./Pages/Signup/Signup";
import Profile from "./Pages/Profile/Profile";
import AdminDashboard from "./Pages/Admin/Admin";
import { AdminRoute } from "./Componets/checkadmin";
import { Checkcom } from "./Componets/checkcomp";
import Journes from "./Pages/Companey/Journes/Journes";
import CompLayout from "./Layout/companyLayout/CompLayout";
import AddJourney from "./Pages/Companey/Add/Add";
import CheckUser from "./Componets/checkuser";
import Search from "./Pages/Customer/Serch/Search";
import Companies from "./Pages/Customer/companies/Companies";
import JoureniesAcompany from "./Pages/Customer/JoureniesAcompany/JoureniesAcompany";
import Journey from "./Pages/Customer/Joureny/Journey";
import Reverc from "./Pages/Customer/Reverc/Reverc";
import MyReserv from "./Pages/Customer/MyReserv/MyReserv";
import JourneyDetails from "./Pages/Companey/JourneyDetails/JourneyDetails";
import CompanyDashbord from "./Pages/Companey/CompanyDashbord";
import Notifications from "./Pages/Notifications/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<CheckUser />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reserve" element={<Search />} />
          <Route path="/reserve/companies" element={<Companies />} />
          <Route path="/reserve/company-journeys" element={<JoureniesAcompany />} />
          <Route path="/reserve/company-journeys/:id" element={<Journey />} />
          <Route path="/reserve/company-journeys/:id/:seatId" element={<Reverc />} />
          <Route path="/my-reverc" element={<MyReserv />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<Checkcom />}>
          <Route element={<CompLayout />}>
            <Route path="/company-dashboard" element={<CompanyDashbord />} />
            <Route path="/company-dashboard/add" element={<AddJourney />} />
            <Route path="/company-dashboard/all-jourenes" element={<Journes />} />
            <Route path="/company-dashboard/journey-details/:id" element={<JourneyDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
