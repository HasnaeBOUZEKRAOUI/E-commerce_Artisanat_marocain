import HeroSection        from "../components/home/HeroSection";
import CategoriesSection  from "../components/home/CategoriesSection";
import StyleSection       from "../components/home/StyleSection";
import ArtisansSection    from "../components/home/ArtisansSection";
import ProductsSection    from "../components/home/ProductsSection";
import Newsletter         from "../components/home/Newsletter";
import WhyUs              from "../components/home/WhyUs";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <StyleSection />
      <ArtisansSection />
      <ProductsSection />
      <WhyUs />
    </main>
  );
}