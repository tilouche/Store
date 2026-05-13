import {
  useEffect,
  useState,
} from "react";

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
  useRef,
} from "react";
export default function ProductDetails() {

  const { id } = useParams();

 const formRef =
  useRef(null);

  const navigate =
    useNavigate();

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

  const [zoomStyle, setZoomStyle] =
    useState({});
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
  // ============================
  // FETCH
  // ============================

  useEffect(() => {

    fetchProduct();

  }, []);

  const fetchProduct =
    async () => {

      try {

        const data =
          await getProductById(id);

        setProduct(data);

        setSelectedImage(
          data.image
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
          "Choose size"
        );
      }

      const cart =
        JSON.parse(
          localStorage.getItem(
            "cart"
          )
        ) || [];

      const existing =
        cart.find(
          (item) =>
            item.id === product.id &&
            item.selectedSize ===
              selectedSize &&
            item.selectedColor ===
              selectedColor
        );

      if (existing) {

        existing.quantity += 1;

      } else {

        cart.push({

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
        JSON.stringify(cart)
      );

      toast.success(
        "🛒 Added to cart"
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
    <div className="max-w-7xl mx-auto bg-white min-h-screen lg:min-h-0 lg:rounded-[40px] overflow-hidden grid lg:grid-cols-2">
        {/* IMAGES */}
        <div className="p-3 md:p-6">

          {/* MAIN */}
          <div className="overflow-hidden rounded-[30px] bg-gray-100">

            <img
              src={
                selectedImage
              }
              alt=""
              onMouseMove={(e) => {

                const {
                  left,
                  top,
                  width,
                  height,
                } =
                  e.target.getBoundingClientRect();

                const x =
                  ((e.clientX - left) /
                    width) *
                  100;

                const y =
                  ((e.clientY - top) /
                    height) *
                  100;

                setZoomStyle({
                  transformOrigin:
                    `${x}% ${y}%`,
                  transform:
                    "scale(2)",
                });
              }}

              onMouseLeave={() => {

                setZoomStyle({
                  transform:
                    "scale(1)",
                });
              }}

              style={zoomStyle}

              className="w-full h-[500px] md:h-[850px] object-cover transition duration-200"
            />

          </div>

          {/* GALLERY */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

            {gallery.map(
              (
                img,
                index
              ) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() =>
                    setSelectedImage(
                      img
                    )
                  }
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover cursor-pointer border-4 transition ${
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
          <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight">

            {product.name}

          </h1>

          {/* PRICE */}
          <p className="text-4xl md:text-5xl font-black text-green-600 mt-6">

            {product.price} DT

          </p>

          {/* SIZES */}
          {sizes.length > 0 && (

            <div className="mt-10">

              <h3 className="font-black text-lg mb-4">

المقاس    
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
                    className={`w-16 h-16 rounded-2xl border text-lg font-black transition ${
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

            <div className="mt-10">

              <h3 className="font-black text-lg mb-4">

              اللون
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
  <h2 className="text-3xl font-black mb-8">

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
      type="text"
      placeholder="الهاتف"
      value={phone}
      onChange={(e) =>
        setPhone(
          e.target.value
        )
      }
className={`w-full h-16 border-2 rounded-2xl px-5 text-xl outline-none ${
  errors.phone
    ? "border-red-500"
    : "border-gray-200"
}`}      />

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

      <option>
        Tunis
      </option>

      <option>
        Sfax
      </option>

      <option>
        Sousse
      </option>

      <option>
        Nabeul
      </option>

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

{/* DESKTOP BUTTONS */}
<div className="hidden md:flex mt-auto pt-10 gap-4">

  <button
    onClick={handleAddToCart}
    className="flex-1 bg-black text-white py-5 rounded-3xl font-black"
  >

    Add To Cart

  </button>

  <button
    onClick={handleBuyNow}
    className="flex-1 bg-green-600 text-white py-5 rounded-3xl font-black"
  >

    Commander Maintenant

  </button>

</div>

          </div>

        </div>

     
       
    </div>
  );
}