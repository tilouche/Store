import {
  useEffect,
  useState,
} from "react";


import {
  deleteLiveCustomer,
} from "../services/supabase";

import {
  ShoppingCart,
} from "lucide-react";

import CartDrawer from "../components/CartDrawer";
import {
  saveLiveCustomer,
} from "../services/supabase";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";
import {
  createOrder,
} from "../services/supabase";
import {
  getProductById,
} from "../services/supabase";
import {
  getRelatedProducts,
} from "../services/supabase";

import {
  useRef,
} from "react";
import {
  Menu,
  X,
} from "lucide-react";
export default function ProductDetails() {

  const { id } = useParams();
  

 const formRef =
  useRef(null);

  const navigate =
    useNavigate();
    


     const [cart, setCart] =
  useState(

    JSON.parse(
      localStorage.getItem(
        "cart"
      )
    ) || []
  );

    const [cartOpen, setCartOpen] =
  useState(false);

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedSize, setSelectedSize] =
    useState("");

  const [
    selectedColor,
    setSelectedColor,
  ] = useState("");

  const [selectedImage, setSelectedImage] =
    useState("");


    const [quantity, setQuantity] =
  useState(1);
  const [clientName, setClientName] =
  useState("");

const [phone, setPhone] =
  useState("");

const [address, setAddress] =
  useState("");

const [city, setCity] =
  useState("");

  const [errors, setErrors] =
  useState({});

const delivery = 8;

const subtotal =
  (product?.price || 0) *
  quantity;

const total =
  subtotal + delivery;


  const [relatedProducts,
setRelatedProducts] =
  useState([]);

const cartCount =
  cart.reduce(
    (acc, item) =>
      acc + item.quantity,
    0
  );

  const [menuOpen,
setMenuOpen] =
  useState(false);
  // ============================
  // FETCH
  // ============================

  useEffect(() => {

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  fetchProduct();

}, [id]);

const fetchProduct =
  async () => {

    try {

      const data =
        await getProductById(id);

      setProduct(data);

      setSelectedImage(
        data.image
      );

      // RELATED PRODUCTS
      const related =
        await getRelatedProducts(

          data.category,

          data.id
        );
        
        console.log(related);
        

      setRelatedProducts(
        related
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };

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
  // NOT FOUND
  // ============================

  if (!product) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-black">
          Product Not Found
        </h1>

      </div>
    );
  }

  // ============================
  // PARSE
  // ============================

  const sizes =
    Array.isArray(product.sizes)
      ? product.sizes
      : typeof product.sizes ===
        "string"
      ? product.sizes
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll('"', "")
          .split(",")
      : [];

  const colors =
    Array.isArray(product.colors)
      ? product.colors
      : typeof product.colors ===
        "string"
      ? product.colors
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll('"', "")
          .split(",")
      : [];

  const gallery =
    product.images?.length
      ? product.images
      : [product.image];

 const currentImageIndex =
  gallery.findIndex(
    (img) =>
      img === selectedImage
  );

  // ============================
  // COLOR SELECT
  // ============================

  const handleColorSelect =
    (color, image) => {

      setSelectedColor(
        color
      );

      setSelectedImage(
        image
      );
    };

    const nextImage =
  () => {

    const nextIndex =
      currentImageIndex ===
      gallery.length - 1

        ? 0

        : currentImageIndex + 1;

    setSelectedImage(
      gallery[nextIndex]
    );
  };

const prevImage =
  () => {

    const prevIndex =
      currentImageIndex === 0

        ? gallery.length - 1

        : currentImageIndex - 1;

    setSelectedImage(
      gallery[prevIndex]
    );
  };
  // ============================
  // ADD TO CART
  // ============================

  const handleAddToCart =
    () => {

      if (
        sizes.length > 0 &&
        !selectedSize
      ) {

        return toast.error(
"اختر المقاس"
        );
      }

   const updatedCart =
      [...cart];

    const existing =
      updatedCart.find(
        (item) =>
          item.id ===
            product.id &&
          item.selectedSize ===
            selectedSize &&
          item.selectedColor ===
            selectedColor
      );

    if (existing) {

      existing.quantity +=
        quantity;

    } else {

      updatedCart.push({

        ...product,

        quantity,

        selectedSize,

        selectedColor,

        image:
          selectedImage,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );

    setCart(
      updatedCart
    );

    toast.success(
      "🛒 تمت الإضافة إلى سلة التسوق"
    );
  };

    const validateForm =
  () => {

    const newErrors = {};

    if (!clientName)
      newErrors.clientName = true;

    if (!phone)
      newErrors.phone = true;

    if (!address)
      newErrors.address = true;

    if (!city)
      newErrors.city = true;

    if (
      sizes.length > 0 &&
      !selectedSize
    ) {

      newErrors.size = true;
    }

    setErrors(
      newErrors
    );

    // SCROLL
    if (
      Object.keys(
        newErrors
      ).length > 0
    ) {

      formRef.current?.scrollIntoView({

        behavior:
          "smooth",
      });

      toast.error(
        "أكمل المعلومات"
      );

      return false;
    }

    return true;
  };
  // ============================
  // BUY NOW
  // ============================

  const handleBuyNow =
  async () => {

    if (!validateForm())
      return;

    try {

      const order = {

        client_name:
          clientName,

        phone,

        address:
          `${address} - ${city}`,

        total,

        status:
          "nouveau",

        items: [

          {

            id: product.id,

            name:
              product.name,

            image:
              selectedImage,

            quantity,

            price:
              product.price,

            selectedSize,

            selectedColor,
          },
        ],
      };
console.log(
  "ORDER 👉",
  order
);
      await createOrder(
        order
      );
console.log(
  "ORDER SENT ✅"
);
await deleteLiveCustomer(
  phone
);
      toast.success(
        "✅ تم إرسال الطلب"
      );

      // RESET
      setClientName("");

      setPhone("");

      setAddress("");

      setCity("");

      setQuantity(1);

    } catch (err) {

      console.log(
  "ERROR 👉",
  err
);
      toast.error(
        "حدث خطأ"
      );
    }
  };
  
  // ============================
  // UI
  // ============================

  return (

      <div
  dir="rtl"
  className="min-h-screen bg-[#f5f5f5]"
>
  {/* NAVBAR */}
<div className="bg-[#B2D8D8] shadow-sm sticky top-0 z-50">

  <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-3">
  {/* CART */}
    <button
      onClick={() =>
        setCartOpen(true)
      }
      className="relative bg-black text-white p-3 md:p-4 rounded-2xl"
    >

      <ShoppingCart />

      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">

        {cart.length}

      </span>

    </button>
          <h1>         
             Logo🛍 
          </h1>
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

  
  </div>
{/* MOBILE MENU */}
<div
  className={`fixed top-0 left-0 w-80 h-screen bg-[#B2D8D8] z-[999] transition-all duration-300 ${
    menuOpen

      ? "translate-x-0"

      : "-translate-x-full"
  }`}
>

  {/* TOP */}
  <div className="flex justify-between items-center p-6 border-b">

    <h2 className="text-3xl font-black">

      🛍 Menu

    </h2>

    <button
      onClick={() =>
        setMenuOpen(false)
      }
      className="bg-gray-100 p-3 rounded-2xl"
    >

      <X />

    </button>

  </div>

  {/* LINKS */}
  <div className="p-6 flex flex-col gap-4">

    <button
      onClick={() => {

        navigate("/");

        setMenuOpen(false);
      }}

      className="h-16 rounded-2xl text-xl font-black bg-black text-white"
    >

      Home

    </button>

    <button
      onClick={() => {

        navigate("/?category=Ensemble");
        setMenuOpen(false);
      }}

      className="h-16 rounded-2xl text-xl font-black bg-gray-100"
    >

      Ensemble

    </button>

    <button
      onClick={() => {

        navigate("/?category=T-Shirt");

        setMenuOpen(false);
      }}

      className="h-16 rounded-2xl text-xl font-black bg-gray-100"
    >

      T-Shirt

    </button>

  </div>

</div>
</div>
    <div className="max-w-7xl mx-auto bg-white min-h-screen lg:min-h-0 lg:rounded-[40px] overflow-hidden grid lg:grid-cols-2">
        {/* IMAGES */}
        <div className="p-7 md:p-6">

{/* MAIN */}
<div className="relative overflow-hidden rounded-[30px] bg-gray-100">
            <img
              src={
                selectedImage
              }
              alt=""
            loading="eager"
              className="w-full h-[500px] md:h-[850px] object-cover transition duration-200"
            />
            {/* LEFT */}
<button
  onClick={prevImage}
  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
>

  <ChevronLeft size={30} />

</button>

{/* RIGHT */}
<button
  onClick={nextImage}
  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 backdrop-blur-md w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
>

  <ChevronRight size={30} />

</button>

          </div>

          {/* GALLERY */}
          <div className="flex gap-1 mt-3 overflow-x-auto pb-1">

            {gallery.map(
              (
                img,
                index
              ) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  loading="lazy"
                  onClick={() =>
                    setSelectedImage(
                      img
                    )
                  }
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover cursor-pointer border-5 transition ${
                    selectedImage ===
                    img
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />
              )
            )}

          </div>

        </div>

        {/* CONTENT */}
          <div className="p-5 md:p-10 flex flex-col pb-36 md:pb-10">
          {/* CATEGORY */}
          <p className="text-gray-400 uppercase tracking-[4px] text-sm">

            {product.category}

          </p>

          {/* TITLE */}
          <h1 className="text-3xl md:text-5xl font-black mt-2 leading-tight">

            {product.name}

          </h1>

          {/* PRICE */}
          <p className="text-4xl md:text-5xl font-black text-green-600 mt-4">

            {product.price} DT

          </p>

          {/* SIZES */}
          {sizes.length > 0 && (

            <div className="mt-4">

              <h3 className="font-black text-lg mb-4">

المقاس    :
              </h3>

              <div className="flex gap-3 flex-wrap">

                {sizes.map((size) => (

                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(
                        size.trim()
                      )
                    }
                    className={`w-12 h-12 rounded-2xl border text-lg font-black transition ${
  selectedSize ===
  size.trim()
    ? "bg-black text-white border-black"
    : errors.size
    ? "border-red-500"
    : "border-gray-200"
}`}
                  >

                    {size.trim()}

                  </button>
                ))}

              </div>

            </div>
          )}

          {/* COLORS */}
          {colors.length > 0 && (

            <div className="mt-8">

              <h3 className="font-black text-lg mb-4">

              اللون :
              </h3>

              <div className="flex gap-4 flex-wrap">

                {colors.map(
                  (
                    color,
                    index
                  ) => (

                    <div
                      key={color}
                      onClick={() =>
                        handleColorSelect(
                          color.trim(),
                          gallery[
                            index
                          ]
                        )
                      }
                      className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition ${
                        selectedColor ===
                        color.trim()
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >

                      <img
                        src={
                          gallery[
                            index
                          ]
                        }
                        alt=""
                        loading="lazy"
                        className="w-20 h-20 object-cover"
                      />

                    </div>
                  )
                )}

              </div>

            </div>
          )}

       
          {/* CHECKOUT FORM */}
<div
  ref={formRef}

  >
  {/* TITLE */}
  <h2 className="text-3xl font-black mb-6">

    معلومات الطلب

  </h2>

  {/* NAME */}
  <div className="mb-6">

    <label className="font-black text-xl block mb-3">

      الاسم واللقب *

    </label>

    <input
      type="text"
      placeholder="الاسم واللقب"
      value={clientName}
      onChange={(e) =>
        setClientName(
          e.target.value
        )
      }
className={`w-full h-16 border-2 rounded-2xl px-5 text-xl outline-none ${
  errors.clientName
    ? "border-red-500"
    : "border-gray-200"
}`}    />

  </div>

  {/* PHONE */}
  <div className="mb-6">

    <label className="font-black text-xl block mb-3">

      الهاتف *

    </label>

    <input
  type="tel"
  placeholder="الهاتف"
  value={phone}

  onChange={async (e) => {

    const value =

      e.target.value

        .replace(/\D/g, "")

        .slice(0, 8);

    setPhone(value);

    // SAVE LIVE CLIENT
    if (
      value.length === 8
    ) {

      try {

        console.log(
          "SAVING LIVE CLIENT"
        );

        await saveLiveCustomer({

          phone: value,

          client_name:
            clientName,

          product_name:
            product.name,
        });

      } catch (err) {

        console.log(err);
      }
    }
  }}

  className={`w-full h-16 border-2 rounded-2xl px-5 text-xl outline-none ${
    errors.phone
      ? "border-red-500"
      : "border-gray-200"
  }`}
/>
</div>

  {/* ADDRESS */}
  <div className="mb-6">

    <label className="font-black text-xl block mb-3">

      العنوان *

    </label>

    <input
      type="text"
      placeholder="العنوان"
      value={address}
      onChange={(e) =>
        setAddress(
          e.target.value
        )
      }
className={`w-full h-16 border-2 rounded-2xl px-5 text-xl outline-none ${
  errors.address
    ? "border-red-500"
    : "border-gray-200"
}`}      />

  </div>

  {/* CITY */}
  <div className="mb-8">

    <label className="font-black text-xl block mb-3">

      المدينة *

    </label>

    <select
      value={city}
      onChange={(e) =>
        setCity(
          e.target.value
        )
      }
className={`w-full h-16 border-2 rounded-2xl px-5 text-xl outline-none ${
  errors.city
    ? "border-red-500"
    : "border-gray-200"
}`}      >

      <option value="">
        اختر المدينة
      </option>

    <option>Tunis</option>
<option>Ariana</option>
<option>Ben Arous</option>
<option>Manouba</option>
<option>Nabeul</option>
<option>Zaghouan</option>
<option>Sousse</option>
<option>Monastir</option>
<option>Mahdia</option>
<option>Sfax</option>
<option>Skhira</option>
<option>Gabès</option>
<option>Medenine</option>
<option>Tataouine</option>
<option>Gafsa</option>
<option>Tozeur</option>
<option>Kebili</option>
<option>Kairouan</option>
<option>Kasserine</option>
<option>Sidi Bouzid</option>
<option>Jendouba</option>
<option>Kef</option>
<option>Siliana</option>
<option>Bizerte</option>

    </select>

  </div>

  {/* SUMMARY */}
  <div className="bg-white rounded-[30px] border p-6">

    <h3 className="text-3xl font-black mb-6">

      ملخص الطلب

    </h3>

    <div className="flex justify-between mb-4 text-lg">

      <span>

        {product.name}
{" "}
×
{" "}
{quantity}
        {" "}
        (
        {selectedSize || "-"}
        ,
        {" "}
        {selectedColor || "-"}
        )

      </span>

      <span>

        {subtotal} د.ت

      </span>

    </div>

    <div className="flex justify-between mb-4 text-lg text-gray-500">

      <span>
        التوصيل
      </span>

      <span>
        8 د.ت
      </span>

    </div>

    <div className="border-t pt-5 flex justify-between text-3xl font-black">

      <span>
        المجموع
      </span>

      <span>

        {total}
        {" "}
        د.ت

      </span>

    </div>

  </div>

  {/* BUTTONS */}
  <div className="mt-8 space-y-4">

    {/* BUY */}
    <button
      onClick={handleBuyNow}
      className="w-full bg-indigo-900 text-white h-16 rounded-2xl text-2xl font-black"
    >

      اشترِ الآن 🛒

    </button>

    {/* ADD CART */}
    <button
      onClick={handleAddToCart}
      className="w-full border-2 border-indigo-900 text-indigo-900 h-16 rounded-2xl text-2xl font-black transition"
    >

      أضف إلى السلة 🛍

    </button>

  </div>

</div>

    

              {/* STICKY BAR */}
<div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-50 md:hidden">

  {/* BUY */}
  <button
    onClick={handleBuyNow}
    className="flex-1 bg-black text-white rounded-2xl h-14 text-xl font-black"
  >

    اشترِ الآن 🛒

  </button>

  {/* QUANTITY */}
  <div className="flex items-center border rounded-2xl overflow-hidden">

    <button
      onClick={() =>
        setQuantity(
          Math.max(
            1,
            quantity - 1
          )
        )
      }
      className="w-14 h-14 text-2xl"
    >

      -

    </button>

    <div className="w-14 text-center font-black text-xl">

      {quantity}

    </div>

    <button
      onClick={() =>
        setQuantity(
          quantity + 1
        )
      }
      className="w-14 h-14 text-2xl"
    >

      +

    </button>

  </div>

</div>

{/* RELATED PRODUCTS */}
<div className="mt-24">

  <h2 className="text-4xl font-black mb-10">

    Produits similaires

  </h2>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

    {relatedProducts.map(
      (item) => (

        <div
  key={item.id}

  onClick={() =>
    navigate(
      `/product/${item.id}`
    )
  }

  className="cursor-pointer group"
>

          {/* IMAGE */}
          <div className="overflow-hidden rounded-[30px] bg-gray-100">

            <img
              src={
                item.image
              }
              alt=""
              loading="lazy"
              className="w-full h-72 object-cover group-hover:scale-105 transition duration-300"
            />

          </div>

          {/* INFO */}
          <div className="mt-4">

            <h3 className="font-black text-xl">

              {item.name}

            </h3>

            <p className="text-green-600 font-black mt-2">

              {item.price}
              {" "}
              DT

            </p>

          </div>

        </div>
      )
    )}

  </div>

</div>
    </div>
    </div>
    <CartDrawer
  open={cartOpen}
  setOpen={setCartOpen}
  cart={cart}
  setCart={setCart}
/>
    </div>
  );
}