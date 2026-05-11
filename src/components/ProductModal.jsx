import { useState } from "react";
import {
  uploadImage,
} from "../services/supabase";

export default function ProductModal({
  open,
  setOpen,
  onAdd,
}) {

  const [uploading, setUploading] =
    useState(false);

 const [form, setForm] = useState({
  name: "",
  price: "",
  stock: "",
  category: "",
  image: "",
  images: [],
  sizes: "",
  colors: "",
});

  // ============================
  // HANDLE CHANGE
  // ============================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    console.log(
      "SUBMIT WORKING"
    );

    try {

            await onAdd({
        ...form,

        price: Number(form.price),

        stock: Number(form.stock),

        sizes:
  typeof form.sizes === "string"
    ? form.sizes
        .split(",")
        .map((s) => s.trim())
    : form.sizes,

        colors:
  typeof form.colors === "string"
    ? form.colors
        .split(",")
        .map((c) => c.trim())
    : form.colors,
        });

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        image: "",
        images: [],
     
      });

      setOpen(false);

    } catch (err) {

      console.error(err);
    }
  };

  // ============================

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-black">
            ➕ Add Product
          </h2>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="text-xl"
          >
            ✕
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
            required
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
            required
          />

          {/* STOCK */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
            required
          />

          {/* CATEGORY */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
          />

          {/* IMAGE */}
          <div>

            <label className="block mb-2 font-semibold">
              Product Image
            </label>

            <input
                type="file"
                accept="image/*"
                multiple
              onChange={async (e) => {

  const files =
    Array.from(
      e.target.files
    );

  if (!files.length) return;

  try {

    setUploading(true);

    const uploadedImages = [];

    for (const file of files) {

      const imageUrl =
        await uploadImage(file);

      uploadedImages.push(
        imageUrl
      );
    }

    setForm((prev) => ({

      ...prev,

      image:
        uploadedImages[0],

      images: [
        ...(prev.images || []),
        ...uploadedImages,
      ],
    }));

    alert(
      "✅ Images uploaded"
    );

  } catch (err) {

    console.error(err);

    alert(
      "❌ Upload failed"
    );

  } finally {

    setUploading(false);
  }
}}
            />
            <div className="flex gap-3 mt-4 flex-wrap">

  {form.images?.map(
    (img, index) => (

      <img
        key={index}
        src={img}
        alt=""
        className="w-24 h-24 object-cover rounded-2xl border"
      />

    )
  )}

</div>

          </div>
              <input
  type="text"
  placeholder="Sizes (S,M,L,XL)"
  onChange={(e) =>
    setForm({
      ...form,
      sizes:
  e.target.value
    .split(",")
    .map((s) => s.trim()),
    })
  }
  className="w-full border p-4 rounded-2xl"
/>
<input
  type="text"
  name="colors"
  placeholder="Colors ex: Black,White,Blue"
  value={form.colors}
  onChange={handleChange}
  className="w-full border p-4 rounded-2xl"
/>
          {/* SUBMIT */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-bold transition"
          >

            {uploading
              ? "Uploading..."
              : "Add Product"}

          </button>

        </form>
      </div>
    </div>
  );
}