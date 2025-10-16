import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Product from "./Pages/Product";
import Login from "./Pages/Login";
import PlaceOrder from "./Pages/PlaceOrder";
import Order from "./Pages/Order";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SearchBar from "./Components/SearchBar";
import Card from "./Pages/Card";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailVerify from "./Pages/EmailVerify";
import ResetPassword from "./Pages/ResetPassword";

const App = () => {
  return (
    <div className="px-3 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] overflow-x-hidden max-w-screen">
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="collection" element={<Collection />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="products/:productId" element={<Product />} />
        <Route path="card" element={<Card />} />
        <Route path="login" element={<Login />} />
        <Route path="placeOrder" element={<PlaceOrder />} />
        <Route path="order" element={<Order />} />
        <Route path="email-verify" element={<EmailVerify/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default App;
