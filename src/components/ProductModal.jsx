import { useState } from "react";

import toast from "react-hot-toast";

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

  const [form, setForm] =
    useState({

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
  // CHANGE
  // ============================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  // ============================
  // UPLOAD
  // ============================

  const handleUpload =
    async (e) => {

      const files =
        Array.from(
          e.target.files
        );

      if (!files.length)
        return;

      try {

        setUploading(true);

        const uploadedImages =
          [];

        for (const file of files) {

          const imageUrl =
            await uploadImage(
              file
            );

          uploadedImages.push(
            imageUrl
          );
        }

        setForm((prev) => ({

          ...prev,

          image:
            uploadedImages[0],

          images: [
            ...(prev.images ||
              []),

            ...uploadedImages,
          ],
        }));

        toast.success(
          "✅ Images uploaded"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Upload failed"
        );

      } finally {

        setUploading(false);
      }
    };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await onAdd({

          ...form,

          price:
            Number(
              form.price
            ),

          stock:
            Number(
              form.stock
            ),

          sizes:
            typeof form.sizes ===
            "string"
              ? form.sizes
                  .split(",")
                  .map((s) =>
                    s.trim()
                  )
              : form.sizes,

          colors:
            typeof form.colors ===
            "string"
              ? form.colors
                  .split(",")
                  .map((c) =>
                    c.trim()
                  )
              : form.colors,
        });

        toast.success(
          "🛍 Product added"
        );

        setForm({

          name: "",

          price: "",

          stock: "",

          category: "",

          image: "",

          images: [],

          sizes: "",

          colors: "",
        });

        setOpen(false);

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed"
        );
      }
    };

  // ============================

  if (!open) return null;

  // ============================
  // UI
  // ============================

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3">

      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b">

          <div>

            <h2 className="text-3xl font-black">
              ➕ Add Product
            </h2>

            <p className="text-gray-400 mt-1">

              Create new product

            </p>

          </div>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="text-2xl"
          >
            ✖
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="p-6 space-y-6"
        >

          {/* NAME */}
          <div>

            <label className="font-bold block mb-2">

              Product Name

            </label>

            <input
              type="text"
              name="name"
              placeholder="Nike T-Shirt"
              value={form.name}
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-2xl"
              required
            />

          </div>

          {/* PRICE + STOCK */}
          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="font-bold block mb-2">

                Price

              </label>

              <input
                type="number"
                name="price"
                placeholder="120"
                value={form.price}
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-2xl"
                required
              />

            </div>

            <div>

              <label className="font-bold block mb-2">

                Stock

              </label>

              <input
                type="number"
                name="stock"
                placeholder="10"
                value={form.stock}
                onChange={
                  handleChange
                }
                className="w-full border p-4 rounded-2xl"
                required
              />

            </div>

          </div>

          {/* CATEGORY */}
          <div>

            <label className="font-bold block mb-2">

              Category

            </label>

            <input
              type="text"
              name="category"
              placeholder="Men"
              value={form.category}
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-2xl"
            />

          </div>

          {/* SIZES */}
          <div>

            <label className="font-bold block mb-2">

              Sizes

            </label>

            <input
              type="text"
              name="sizes"
              placeholder="S,M,L,XL"
              value={form.sizes}
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-2xl"
            />

          </div>

          {/* COLORS */}
          <div>

            <label className="font-bold block mb-2">

              Colors

            </label>

            <input
              type="text"
              name="colors"
              placeholder="Black,White,Blue"
              value={form.colors}
              onChange={
                handleChange
              }
              className="w-full border p-4 rounded-2xl"
            />

          </div>

          {/* IMAGES */}
          <div>

            <label className="font-bold block mb-4">

              Product Images

            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleUpload
              }
              className="w-full border p-4 rounded-2xl"
            />

            {/* PREVIEW */}
            {form.images
              ?.length > 0 && (

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

                {form.images.map(
                  (
                    img,
                    index
                  ) => (

                    <div
                      key={index}
                      className="relative"
                    >

                      <img
                        src={img}
                        alt=""
                        className="w-full h-28 object-cover rounded-2xl border"
                      />

                      {/* MAIN */}
                      {index ===
                        0 && (

                        <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-xl">

                          Main

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={
              uploading
            }
            className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-3xl text-lg font-black transition"
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