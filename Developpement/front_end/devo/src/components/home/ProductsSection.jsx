import ProductCard from "./ProductCard";
import { useCartContext } from "../../context/CartContext";

import img7 from "../../assets/images/img7.jpg";

const sampleProducts = [
  {
    id: 1,
    name: "Produit 1",
    img: img7,
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
  {
    id: 2,
    name: "Produit 2",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
  {
    id: 3,
    name: "Produit 3",
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
];

const bijouxProducts = [
  {
    id: 4,
    name: "Bijou 1",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
  {
    id: 5,
    name: "Bijou 2",
    img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
];

const gastronomieProducts = [
  {
    id: 6,
    name: "Gastro 1",
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
  {
    id: 7,
    name: "Gastro 2",
    img: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.",
    price: 300.5,
  },
];

/* =========================
   PRODUCT GRID COMPONENT
========================= */
function ProductGrid({ title, products }) {
  const { addItem } = useCartContext(); // ✅ hook DANS le composant

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      image_url: product.img,
      price: product.price,
    });
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-10 border border-gray-100 pb-4">
        <h2 className="font-manuale text-3xl md:text-4xl font-bold uppercase tracking-tight text-black">
          {title}
        </h2>

        <a
          href="#"
          className="font-manrope text-[13px] text-gray-900 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
        >
          Voir plus <span className="text-lg">→</span>
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            img={product.img}
            description={product.description}
            price={product.price}
            onAdd={() => handleAddToCart(product)} // ✅ click handler
          />
        ))}
      </div>
    </div>
  );
}

/* =========================
   MAIN SECTION
========================= */
export default function ProductsSection() {
  return (
    <section className="py-2 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <ProductGrid title="Nouveautés" products={sampleProducts} />
        <ProductGrid title="Faites Briller Vos Tables" products={sampleProducts} />
        <ProductGrid title="Bijoux" products={bijouxProducts} />
        <ProductGrid title="Goût du Maroc" products={gastronomieProducts} />
      </div>
    </section>
  );
}