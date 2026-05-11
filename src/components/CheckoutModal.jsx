import { useState } from "react";

import toast from "react-hot-toast";

import { createOrder } from "../services/supabase";

export default function CheckoutModal({
  open,
  setOpen,
  cart,
  setCart,
}) {

  // ============================
  // STATES
  // ============================

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      client_name: "",
      phone: "",
      address: "",
    });

  // ============================
  // TOTAL
  // ============================

  const total = cart.reduce(
  (sum, item) =>
    sum + item.price * item.quantity,
  0
);

  // ============================
  // HANDLE CHANGE
  // ============================

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value,
      });
    };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await createOrder({

          ...form,

          total,

          status: "nouveau",

          items: cart,

        });

        toast.success(
          "✅ Order placed!"
        );

        setCart([]);

        setOpen(false);
        setForm({
        client_name: "",
        phone: "",
        address: "",
        });

      } catch (err) {

        console.log(err);

        toast.error(
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ============================
  // CLOSE
  // ============================

  if (!open) return null;

  // ============================
  // UI
  // ============================

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-[35px] p-8">

        {/* TITLE */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-black">

            🛒 Checkout

          </h2>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        {/* TOTAL */}
        <div className="bg-gray-100 rounded-2xl p-5 mb-6">

          <p className="text-gray-500">
            Total
          </p>

          <h3 className="text-4xl font-black mt-2">

            {total} DT

          </h3>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >

          {/* NAME */}
          <input
            type="text"
            name="client_name"
            placeholder="Full Name"
            value={
              form.client_name
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-2xl outline-none"
            required
          />

          {/* PHONE */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-2xl outline-none"
            required
          />

          {/* ADDRESS */}
          <textarea
            name="address"
            placeholder="Address"
            value={
              form.address
            }
            onChange={
              handleChange
            }
            className="w-full border p-4 rounded-2xl outline-none h-32"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full bg-black hover:bg-gray-800 text-white py-5 rounded-2xl font-black text-lg transition"
          >

            {loading
              ? "Loading..."
              : "Confirm Order"}

          </button>

        </form>

      </div>
    </div>
  );
}