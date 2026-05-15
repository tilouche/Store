import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";
export default function ProductCard({
  product,
}) {

  const navigate =
    useNavigate();
    const images =
  product.images?.length
    ? product.images
    : [product.image];

const [currentImage, setCurrentImage] =
  useState(0);
const nextImage =
  (e) => {

    e.stopPropagation();

    setCurrentImage(
      currentImage ===
      images.length - 1

        ? 0

        : currentImage + 1
    );
  };

const prevImage =
  (e) => {

    e.stopPropagation();

    setCurrentImage(
      currentImage === 0

        ? images.length - 1

        : currentImage - 1
    );
  };
  return (

    <div
      onClick={() =>
        navigate(
          `/product/${product.id}`
        )
      }
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition cursor-pointer group"
    >

     
      {/* IMAGE */}
<div className="relative group overflow-hidden">

  <img
    src={
      images[currentImage]
    }
    alt=""
    className="w-full h-90 object-cover group-hover:scale-105 transition duration-300"
  />

  {/* LEFT */}
  {images.length > 1 && (

    <button
      onClick={prevImage}
      className="absolute opacity-80 top-1/2 left-3 -translate-y-1/2 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition"
    >

      <ChevronLeft size={20} />

    </button>
  )}

  {/* RIGHT */}
  {images.length > 1 && (

    <button
      onClick={nextImage}
      className="absolute opacity-80 top-1/2 right-3 -translate-y-1/2 bg-white/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition"
    >

      <ChevronRight size={20} />

    </button>
  )}

</div>

      {/* CONTENT */}
      <div className="p-5">

        {/* CATEGORY */}
        <p className="text-gray-400 uppercase text-sm tracking-wider">

          {product.category}

        </p>

        {/* NAME */}
        <h3 className="text-2xl font-black mt-2">

          {product.name}

        </h3>

        {/* PRICE */}
        <p className="text-3xl font-black text-green-600 mt-5">

          {product.price}  DT

        </p>

      </div>

    </div>
  );
}