import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Payment from "./pages/Payment";
import Login from "./pages/UserLogin";
import TripDetails from "./pages/TripDetails";
import CompanyLogin from "./pages/CompanyLogin";
import SearchResults from "./pages/SearchResults";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Company from "./components/CompanyDashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/companies" element={<Company />} />
        <Route path="/companies/login" element={<CompanyLogin />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/search-results" element={<SearchResults />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
