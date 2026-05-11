import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ProductCard({
  product,
  addToCart,
}) {

  // ============================
  // FORMAT SIZES
  // ============================
const navigate = useNavigate();
  const parsedSizes =
    Array.isArray(product.sizes)
      ? product.sizes
      : typeof product.sizes === "string"
      ? product.sizes
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll('"', "")
          .split(",")
      : [];

  // ============================
  // FORMAT COLORS
  // ============================

  const parsedColors =
    Array.isArray(product.colors)
      ? product.colors
      : typeof product.colors === "string"
      ? product.colors
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replaceAll('"', "")
          .split(",")
      : [];

  // ============================
  // STATES
  // ============================

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  // ============================
  // ADD TO CART
  // ============================

  const handleAddToCart = () => {

    // SIZE REQUIRED
    if (
      parsedSizes.length > 0 &&
      !selectedSize
    ) {

      alert(
        "⚠️ Please select a size"
      );

      return;
    }

    // COLOR REQUIRED
    if (
      parsedColors.length > 0 &&
      !selectedColor
    ) {

      alert(
        "⚠️ Please select a color"
      );

      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
    });
  };

  // ============================
  // UI
  // ============================

  return (

    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition">

      {/* IMAGE */}
      <img
  onClick={() =>
    navigate(
      `/product/${product.id}`
    )
  }
  src={
    product.image ||
    "https://via.placeholder.com/300"
  }
  alt=""
  className="w-full h-72 object-cover cursor-pointer"
/>

      {/* CONTENT */}
      <div className="p-5">

        {/* NAME */}
        <h3 className="text-2xl font-black">
          {product.name}
        </h3>

        {/* CATEGORY */}
        <p className="text-gray-400 mt-2">
          {product.category}
        </p>

        {/* PRICE */}
        <p className="text-3xl font-black mt-4 text-green-600">
          {product.price} DT
        </p>

        {/* SIZES */}
        {parsedSizes.length > 0 && (

          <div className="mt-5">

            <p className="font-semibold mb-2">
              Select Size
            </p>

            <div className="flex gap-2 flex-wrap">

              {parsedSizes.map((size) => (

                <button
                  key={size}
                  onClick={() =>
                    setSelectedSize(
                      size.trim()
                    )
                  }
                  className={`px-4 py-2 rounded-xl border transition ${
                    selectedSize ===
                    size.trim()
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >

                  {size.trim()}

                </button>
              ))}
            </div>
          </div>
        )}

        {/* COLORS */}
        {parsedColors.length > 0 && (

          <div className="mt-5">

            <p className="font-semibold mb-2">
              Select Color
            </p>

            <div className="flex gap-2 flex-wrap">

              {parsedColors.map((color) => (

                <button
                  key={color}
                  onClick={() =>
                    setSelectedColor(
                      color.trim()
                    )
                  }
                  className={`px-4 py-2 rounded-xl border transition ${
                    selectedColor ===
                    color.trim()
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >

                  {color.trim()}

                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-bold transition"
        >

          Add To Cart

        </button>

      </div>
    </div>
  );
}