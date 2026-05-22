import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import useCart from "../hooks/useCart";
import { getProducts } from "../services/supabase";
import heroImage from "../assets/heroo.jpg";
import { ShoppingCart } from "lucide-react";

import toast from "react-hot-toast";
import {
  Menu,
  X,
} from "lucide-react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function Home() {

  // ============================
  // STATES
  // ============================

  const [products, setProducts] =
    useState([]);

  const {
  cart,
  setCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  total,
} = useCart();

  const [loading, setLoading] =
    useState(true);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [
    openCheckout,
    setOpenCheckout,
  ] = useState(false);

 const [searchParams] =
  useSearchParams();

const selectedCategory =

  searchParams.get(
    "category"
  ) || "all";
 
  const navigate =
  useNavigate();

  const [menuOpen,
setMenuOpen] =
  useState(false);
  // ============================
  // FETCH PRODUCTS
  // ============================

  useEffect(() => {

    fetchProducts();

  }, []);

  const fetchProducts =
    async () => {

      try {

        const data =
          await getProducts();

        setProducts(data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  // ============================
  // ADD TO CART
  // ============================

 

  // ============================
  // LOADING
  // ============================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-black">
          Loading...
        </h1>

      </div>
    );
  }

  // ============================
  // UI
  // ============================

  return (

    <div className="min-h-screen bg-[#fafafa]">

      {/* NAVBAR */}
      <div className="bg-[#B2D8D8] shadow-sm sticky top-0 z-50">

<div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
          {/* LOGO */}
          
          {/* MOBILE MENU */}
<button
  onClick={() =>
    setMenuOpen(
      !menuOpen
    )
  }
  className="md:hidden bg-gray-100 p-3 rounded-2xl"
>

  {menuOpen

    ? <X />

    : <Menu />}
    
</button>

{/* CATEGORIES */}
<div className="hidden md:flex  items-center gap-3">

{[
  "all",
  "Ensemble",
  "T-Shirt",
].map((cat) => (

    <button
      key={cat === "all"
  ? "Home"
  : cat}

      onClick={() =>
       navigate(
  cat === "all"

    ? "/"

    : `/?category=${cat}`
)
      }

      className={`px-5 py-2 rounded-2xl font-bold transition ${
        selectedCategory ===
        cat

          ? "bg-black text-white"

          : "bg-gray-100"
      }`}
    >

      {cat}

    </button>
  ))}

</div>
<h1
 onClick={() =>
  navigate("/")
}
  className="text-2xl md:text-3xl font-black cursor-pointer"
>              🛍 Logo
          </h1>

          {/* CART */}
          <button
            onClick={() =>
              setCartOpen(true)
            }
className="relative bg-black text-white p-3 md:p-4 rounded-2xl"          >

            <ShoppingCart />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">

              {cart.length}

            </span>

          </button>

        </div>
       
{/* MOBILE MENU */}
{menuOpen && (

  <div className="md:hidden bg-white border-t px-4 py-5 flex flex-col gap-3">

    {[
      "all",
      "Ensemble",
      "T-Shirt",
    ].map((cat) => (

      <button
        key={cat}

        onClick={() => {

          navigate(

            cat === "all"

              ? "/"

              : `/?category=${cat}`
          );

          setMenuOpen(false);
        }}

        className={`h-14 rounded-2xl font-bold transition ${
          selectedCategory ===
          cat

            ? "bg-[#B2D8D8] text-black"

            : "bg-gray-100"
        }`}
      >

        {cat === "all"
          ? "Home"
          : cat}

      </button>
    ))}

  </div>
 )}
  
  </div>
     {/* HERO */}
<div className="max-w-8xl mx-auto">
  <img
    src={heroImage}
    alt="hero"
    loading="lazy"
    className="w-full h-[130px] md:h-[280px] object-cover rounded-[10px]"
  />



        {/* PRODUCTS HEADER */}
        <div className="flex justify-between items-center mb-2">

         <h2 className="text-2xl mx-auto py-8 font-black">

  {selectedCategory ===
  "all"

    ? "Accueil"

    : selectedCategory ===
      "Ensemble"

    ? "Ensembles"

    : selectedCategory ===
      "T-Shirt"

    ? "T-Shirts"

    : "Produits"}

</h2>

        

        </div>

        {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 md:gap-8 p-5">
          {products

  .filter((product) =>

    selectedCategory ===
    "all"

      ? true

      : product.category ===
        selectedCategory
  )

  .map((product) => (

           <ProductCard
            key={product.id}
            product={product}
            />

          ))}

        </div>
{/* SERVICES */}
<div className="bg-[#efecfa] text-black py-12 mt-24">

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 text-center">

    {/* ITEM */}
    <div>

      <div className="text-3xl mb-4">
        🏠
      </div>

      <h3 className="font-black text-xl uppercase">

        Livraison à domicile

      </h3>

      <p className="mt-3 text-gray-700">

        Toute la Tunisie

      </p>

    </div>

    {/* ITEM */}
    <div>

      <div className="text-3xl mb-4">
        🔄
      </div>

      <h3 className="font-black text-xl">

        Echange

      </h3>

      <p className="mt-3 text-gray-700">

        Echange dans 72H

      </p>

    </div>

    {/* ITEM */}
    <div>

      <div className="text-3xl mb-4">
        🚚
      </div>

      <h3 className="font-black text-xl uppercase">

        Livraison Rapide

      </h3>

      <p className="mt-3 text-gray-700">

        Livraison en 1 à 3 jours

      </p>

    </div>

    {/* ITEM */}
    <div>

      <div className="text-3xl mb-4">
        💵
      </div>

      <h3 className="font-black text-xl uppercase">

        Paiement Cash

      </h3>

      <p className="mt-3 text-gray-700">

        Main à main

      </p>

    </div>

  </div>

</div>

{/* FOOTER */}
<footer className="bg-[#B2d1D8] py-20 relative">

  <div className="max-w-2xl mx-auto px-6">

    {/* CONTACT */}
    <div className="text-center">

      <h2 className="text-3xl font-black">

        Lundi au Dimanche de 9h à 18h

      </h2>

      <p className="text-3xl font-bold mt-4">

        +216 92 700 093

      </p>

    

    </div>

    {/* GRID */}
    <div className="grid grid-cols-3 md:grid-cols-3 gap-5 mt-10 text-center">

      {/* CATEGORIES */}
      <div>

        <h2 className="text-2xl font-black mb-12">

          Catégories

        </h2>

        <div className="space-y-2 text-gray-400 text-1xl">

          <p>Ensemble </p>

          <p>T-shirt</p>

        </div>

      </div>

      {/* RESOURCES */}
      <div>

        <h2 className="text-2xl font-black mb-12">

          Resources

        </h2>

        <div className="space-y-2 text-gray-400 text-1xl">

          <p>Notre histoire</p>

          <p>Contactez-nous</p>

          <p>Livraison et échange</p>

        </div>

      </div>

      {/* SOCIAL */}
      <div>

        <h2 className="text-2xl font-black mb-4">

          Social Media

        </h2>

        <div className="space-y-3 text-gray-400 text-1xl">

          <p>Facebook</p>

          <p>Instagram</p>

          <p>Tiktok</p>

          <p>WhatsApp</p>

        </div>

      </div>

    </div>

    {/* COPYRIGHT */}
    <div className="border-t mt-20 pt-8 text-center text-gray-40 text-lg">
<h3 className="text-3xl font-black mb-5">
         نحن لسنا الوحيدين  لكننا  الأفضل

</h3>


    </div>

  </div>




</footer>

      </div>

      {/* CART DRAWER */}
      <CartDrawer
  open={cartOpen}
  setOpen={setCartOpen}
  cart={cart}
  setCart={setCart}
  total={total}
  increaseQty={increaseQty}
  decreaseQty={decreaseQty}
  removeFromCart={removeFromCart}
  setCheckoutOpen={setOpenCheckout}
/>

      {/* CHECKOUT */}
      <CheckoutModal
        open={openCheckout}
        setOpen={setOpenCheckout}
        cart={cart}
        setCart={setCart}
      />

    </div>
  );
  }