import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar   from "./components/layout/NavBar";
import Footer   from "./components/layout/Footer";
import Home     from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import ArtisansPage from "./pages/ArtisansPage";
import ArtisanDetailPage from "./pages/ArtisanDetailPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import StylePage from "./pages/StylePage";
import AllProductsPage from "./pages/AllProductPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import MesCommandes from "./pages/MesCommandes";
import ProfilPage from "./pages/ProfilPage";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>}/>
        {/* Page catégorie  →  ex: /categories/salon-chambre */}
        <Route path="/panier" element={<CartPage />} />        
        <Route path="/categories/:categorySlug" element={<CategoryPage />} />
        <Route path="/artisans"     element={<ArtisansPage />} />
        <Route path="/artisans/:id" element={<ArtisanDetailPage />} />
        <Route path="/all" element={<AllProductsPage/>}/>
        {/* Page sous-catégorie  →  ex: /categories/salon-chambre/tapis */}
        <Route path="/categories/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
        <Route path="/styles/:styleSlug" element={<StylePage />} />
        <Route path="/produits/:id" element={<ProductPage />} />  
        <Route path="/checkoutPage" element={<CheckoutPage/>}/>
        <Route path="/commandes" element={<MesCommandes />} />
        <Route path="/profil" element={<ProfilPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}