import { BrowserRouter, Routes, Route,Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
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
import AdminDashboard from "./pages/admin/DashboardAdmin";
import AdminArtisan from "./pages/admin/AdminArtisan";
import AdminCommandes from "./pages/admin/AdminCommandes";
import AdminClient from "./pages/admin/AdminClient";

function PublicLayout() {
  return (
    <>
      <NavBar />
      <Outlet /> {/* C'est ici que tes pages (Home, Cart, etc.) s'afficheront */}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Routes avec NavBar et Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/categories/:categorySlug" element={<CategoryPage />} />
          <Route path="/artisans" element={<ArtisansPage />} />
          <Route path="/artisans/:id" element={<ArtisanDetailPage />} />
          <Route path="/all" element={<AllProductsPage />} />
          <Route path="/categories/:categorySlug/:subcategorySlug" element={<CategoryPage />} />
          <Route path="/styles/:styleSlug" element={<StylePage />} />
          <Route path="/produits/:id" element={<ProductPage />} />
          <Route path="/checkoutPage" element={<CheckoutPage />} />
          <Route path="/commandes" element={<MesCommandes />} />
          <Route path="/profil" element={<ProfilPage />} />
        </Route>

        {/* 2. Routes SANS NavBar et Footer (Admin) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/artisans" element={<AdminArtisan />} />
        <Route path="/admin/commandes" element={<AdminCommandes />} />
        <Route path="/admin/clients" element={<AdminClient />} />
      </Routes>
    </BrowserRouter>
  );
}