import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getProductById,
} from "../services/supabase";

export default function ProductDetails() {

  const { id } = useParams();

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

      if (
        colors.length > 0 &&
        !selectedColor
      ) {

        return toast.error(
          "Choose color"
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
          quantity: 1,
          selectedSize,
          selectedColor,
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

  // ============================
  // UI
  // ============================

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto bg-white rounded-[40px] overflow-hidden grid md:grid-cols-2">

        {/* IMAGE */}
       <div className="p-6">

  {/* MAIN IMAGE */}
  <div className="overflow-hidden rounded-[30px]">

    <img
      src={
        selectedImage ||
        "https://via.placeholder.com/600"
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
          transform: "scale(2)",
        });
      }}

      onMouseLeave={() => {

        setZoomStyle({
          transform: "scale(1)",
        });
      }}

      style={zoomStyle}

      className="w-full h-[650px] object-cover transition duration-200 cursor-zoom-in"
    />

  </div>

  {/* GALLERY */}
  <div className="flex gap-4 mt-5 overflow-x-auto">

    {(product.images?.length
      ? product.images
      : [product.image]
    ).map((img, index) => (

      <img
        key={index}
        src={img}
        alt=""
        onClick={() =>
          setSelectedImage(img)
        }
        className={`w-24 h-24 rounded-2xl object-cover cursor-pointer border-4 transition ${
          selectedImage === img
            ? "border-black"
            : "border-transparent"
        }`}
      />

    ))}

  </div>

</div>
        {/* CONTENT */}
        <div className="p-10">

          <p className="text-gray-400 uppercase tracking-[4px]">

            {product.category}

          </p>

          <h1 className="text-5xl font-black mt-4">

            {product.name}

          </h1>

          <p className="text-4xl font-black text-green-600 mt-6">

            {product.price} DT

          </p>

          {/* SIZES */}
          {sizes.length > 0 && (

            <div className="mt-8">

              <h3 className="font-bold mb-3">
                Sizes
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
                    className={`px-5 py-2 rounded-2xl border transition ${
                      selectedSize ===
                      size.trim()
                        ? "bg-black text-white"
                        : "bg-white"
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

              <h3 className="font-bold mb-3">
                Colors
              </h3>

              <div className="flex gap-3 flex-wrap">

                {colors.map((color) => (

                  <button
                    key={color}
                    onClick={() =>
                      setSelectedColor(
                        color.trim()
                      )
                    }
                    className={`px-5 py-2 rounded-2xl border transition ${
                      selectedColor ===
                      color.trim()
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                  >

                    {color.trim()}

                  </button>
                ))}

              </div>

            </div>
          )}

          {/* STOCK */}
          <div className="mt-8">

            <p className="text-gray-500">

              Stock:
              {" "}
              {product.stock}

            </p>

          </div>

          {/* BUTTON */}
          <button
            onClick={
              handleAddToCart
            }
            className="mt-10 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold transition"
          >

            Add To Cart

          </button>

        </div>

      </div>

    </div>
  );
}