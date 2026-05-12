import ProductCard from "./ProductCard";
import img7 from "../../assets/images/img7.jpg";

const sampleProducts = [
  {
    img: img7,
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
];

const bijouxProducts = [
  {
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1602752250015-52934bc45613?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
];

const gastronomieProducts = [
  {
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
  {
    img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
    description: "Lorem ipsum dolor sit amet consectetur.Lorem amet consectetur.",
    price: "300.50 dh",
  },
];

function ProductGrid({ title, products }) {
  return (
    <div className="mb-12">
      {/* En-tête avec Manuale */}
      <div className="flex items-baseline justify-between mb-10 border border-gray-100 pb-4">
        <h2 className="font-manuale text-3xl md:text-4xl font-bold uppercase tracking-tight text-black">
          {title}
        </h2>
        <a href="#" className="font-manrope text-[13px] text-gray-900 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors">
          Voir plus <span className="text-lg">→</span>
        </a>
      </div>

      {/* Grille de produits */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}

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