import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
}) {

  const navigate =
    useNavigate();

  return (

    <div
      onClick={() =>
        navigate(
          `/product/${product.id}`
        )
      }
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition cursor-pointer group"
    >

      {/* IMAGE */}
      <div className="overflow-hidden">

        <img
          src={
            product.image ||
            "https://via.placeholder.com/300"
          }
          alt=""
          className="w-full aspect-[19/20] object-cover group-hover:scale-108 transition duration-300"
        />

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