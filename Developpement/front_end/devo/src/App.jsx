import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar   from "./components/layout/NavBar";
import Footer   from "./components/layout/Footer";
import Home     from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Page catégorie  →  ex: /categories/salon-chambre */}
        <Route path="/categories/:categorySlug" element={<CategoryPage />} />

        {/* Page sous-catégorie  →  ex: /categories/salon-chambre/tapis */}
        <Route path="/categories/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}