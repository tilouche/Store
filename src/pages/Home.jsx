import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import useCart from "../hooks/useCart";
import { getProducts } from "../services/supabase";

import { ShoppingCart } from "lucide-react";

import toast from "react-hot-toast";

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

    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow-sm sticky top-0 z-50">

<div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
          {/* LOGO */}
<h1 className="text-2xl md:text-3xl font-black">            🛍 
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
      </div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-14">

<div className="bg-black text-white rounded-[30px] md:rounded-[40px] p-6 md:p-12 mb-10">
          <p className="uppercase text-sm tracking-[5px] text-gray-400">

            New Collection

          </p>

<h2 className="text-4xl md:text-6xl font-black mt-4 leading-tight">
            Ahmed <br />

            Tilouche

          </h2>

          <p className="text-gray-400 mt-5 max-w-xl">

          

          </p>

        </div>

        {/* PRODUCTS HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-4xl font-black">
            Products
          </h2>

          <p className="text-gray-400">
            {products.length} items
          </p>

        </div>

        {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (

            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />

          ))}

        </div>

      </div>

      {/* CART DRAWER */}
      <CartDrawer
        open={cartOpen}
        setOpen={setCartOpen}
        cart={cart}
        setCart={setCart}
        setCheckoutOpen={
          setOpenCheckout
        }
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