import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import StyleSection from "../components/home/StyleSection";
import ArtisansSection from "../components/home/ArtisansSection";
import ProductsSection from "../components/home/ProductsSection";
import Newsletter from "../components/home/Newsletter";
import WhyUs from "../components/home/WhyUs";

export default function Home() {

  const products = [
    {
      image: "/images/p1.jpg",
      title: "Produit",
      price: 250
    },
    {
      image: "/images/p2.jpg",
      title: "Produit 2",
      price: 300
    },
  ];

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6">

        <HeroSection />

        <CategoriesSection />

        <StyleSection />

        <ArtisansSection />

        <ProductsSection
          title="Nouveautés"
          products={products}
        />

        <ProductsSection
          title="Bijoux"
          products={products}
        />

        <Newsletter />

      </main>
      <WhyUs/>
      <Footer />
    </>
  );
}