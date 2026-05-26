import { useState } from "react";

import toast from "react-hot-toast";

import {
  deleteLiveCustomer,
} from "../services/supabase";

import {
  createOrder,
} from "../services/supabase";

export default function CartDrawer({
  open,
  setOpen,
  cart,
  setCart,
}) {

  // ============================
  // STATES
  // ============================

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

  // ============================
  // TOTAL
  // ============================

  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity,
    0
  );

  const delivery =
    subtotal > 0
      ? 8
      : 0;

  const total =
    subtotal + delivery;

  // ============================
  // VALIDATION
  // ============================

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

      setErrors(
        newErrors
      );

      if (
        Object.keys(
          newErrors
        ).length > 0
      ) {

        toast.error(
          "أكمل المعلومات"
        );

        return false;
      }

      return true;
    };

  // ============================
  // SUBMIT ORDER
  // ============================

  const handleOrder =
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

          items: cart,
        };

        await createOrder(
          order
        );
await deleteLiveCustomer(
  phone
);
        toast.success(
          "✅ تم إرسال الطلب"
        );

        setCart([]);

        

        setClientName("");

        setPhone("");

        setAddress("");

        setCity("");

      } catch (err) {

        console.log(err);

        toast.error(
          "حدث خطأ"
        );
      }
    };

  // ============================
  // QUANTITY +
  // ============================

  const increaseQty = (id) => {

    const updated = cart.map(
      (item) =>

        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
    );

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
      
    );
    setCart(updated);
  };

  // ============================
  // QUANTITY -
  // ============================

  const decreaseQty = (id) => {

    const updated = cart

      .map((item) =>

        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )

      .filter(
        (item) =>
          item.quantity > 0
      );

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );
    setCart(updated);
  };

  // ============================
  // REMOVE
  // ============================

  const removeItem = (id) => {

    const updated =
      cart.filter(
        (item) =>
          item.id !== id
      );

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );
     setCart(updated);
  };

  // ============================

  if (!open) return null;

  // ============================
  // UI
  // ============================

  return (

    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">

      <div
        dir="rtl"
        className="bg-white w-full sm:max-w-lg h-screen overflow-y-auto animate-slide-left"
      >

        {/* HEADER */}
        <div className="sticky top-0 bg-white z-10 border-b p-5 flex justify-between items-center">

          <h2 className="text-3xl font-black">

            🛒 السلة

          </h2>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="text-3xl"
          >
            ✖
          </button>

        </div>

        <div className="p-5">

          {/* EMPTY */}
          {cart.length === 0 && (

            <div className="text-center mt-20">

              <h3 className="text-3xl font-black">

                السلة فارغة

              </h3>

              <p className="text-gray-400 mt-4">

                أضف بعض المنتجات 🛍

              </p>

            </div>
          )}

          {/* ITEMS */}
          <div className="space-y-5">

            {cart.map(
              (
                item,
                index
              ) => (

                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  className="border rounded-[30px] p-3"
                >
                  
<div className="flex flex-row items-center gap-4">

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="w-30 h-46 object-contain rounded-[25px]"
                  />

                  {/* INFO */}
                  <div className="mt-4">

                    <h3 className="text-2xl font-black">

                      {item.name}

                    </h3>
                  {/* OFFER */}
{item.selectedOffer && (

  <div className="mt-3 bg-gray-100 p-3 rounded-2xl">

    <div className="font-black text-black mb-2">

      {item.selectedOffer.title}

    </div>

    {Object.entries(
      item.offerSelections || {}
    ).map(
      ([key, value]) => (

        <div
          key={key}
          className="text-sm text-gray-600"
        >

           {Number(key) + 1}

          {" : "}

          {value.color}

          {" / "}

          {value.size}

        </div>
      )
    )}

  </div>
)}
                    {/* SIZE */}
                    {item.selectedSize && (

                      <p className="text-gray-500 mt-2">

                        المقاس:
                        {" "}
                       {item.selectedOffer ? (

  <div className="mt-2 text-sm">

    <div className="font-black">

      {item.selectedOffer.title}

    </div>

    {Object.entries(
      item.offerSelections || {}
    ).map(
      ([key, value]) => (

        <div key={key}>

          Item {" "}
          {Number(key) + 1}

          {" : "}

          {value.color}

          {" / "}

          {value.size}

        </div>
      )
    )}

  </div>

) : (

  <div className="text-sm text-gray-500">

 {/* NORMAL PRODUCT */}
{!item.selectedOffer ? (

  <div className="text-sm text-gray-500 mt-2">

    {item.selectedSize}
    {" / "}
    {item.selectedColor}

  </div>

) : (

  <div className="mt-3 bg-gray-100 rounded-2xl p-3">

    <div className="font-black mb-2 text-black">

      {item.selectedOffer.title}

    </div>

    {Object.entries(
      item.offerSelections || {}
    ).map(
      ([key, value]) => (

        <div
          key={key}
          className="text-sm text-gray-600 mb-1"
        >

          Piece {" "}
          {Number(key) + 1}

          {" : "}

          {value.color}

          {" / "}

          {value.size}

        </div>
      )
    )}

  </div>
)}
{/* OFFER PRODUCT */}
{item.selectedOffer && (

  <div className="mt-3 bg-gray-100 rounded-2xl p-3">

    <div className="font-black mb-2">

      {item.selectedOffer.title}

    </div>

    {Object.entries(
      item.offerSelections || {}
    ).map(
      ([key, value]) => (

        <div
          key={key}
          className="text-sm text-gray-600 mb-1"
        >

          Piece {" "}
          {Number(key) + 1}

          {" : "}

          {value.color}

          {" / "}

          {value.size}

        </div>
      )
    )}

  </div>
)}

  </div>
)}

                      </p>
                    )}
                    {/* CUSTOM OPTIONS */}
{item.selectedOptions && (

  <div className="mt-3 space-y-2">

    {Object.entries(
      item.selectedOptions
    ).map(
      ([key, value]) => (

        <div
          key={key}
          className="text-sm bg-gray-100 rounded-xl p-2"
        >

          <span className="font-black">

            {key}

          </span>

          {" : "}

          {value.size}

          {" / "}

          {value.color}

        </div>
      )
    )}

  </div>
)}

                    {/* COLOR */}
                    {item.selectedColor && (

                      <p className="text-gray-500">

                        اللون:
                        {" "}
                        {
                          item.selectedColor
                        }

                      </p>
                    )}

                    {/* PRICE */}
                    <p className="text-3xl font-black text-green-600 mt-4">

                      {item.price}
                      {" "}
                      د.ت

                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center justify-between mt-5">

                      <div className="flex items-center border rounded-2xl overflow-hidden">

                        <button
                          onClick={() =>
                            decreaseQty(
                              item.id
                            )
                          }
                          className="w-14 h-14 text-2xl"
                        >

                          -

                        </button>

                        <div className="w-14 text-center text-xl font-black">

                          {
                            item.quantity
                          }

                        </div>

                        <button
                          onClick={() =>
                            increaseQty(
                              item.id
                            )
                          }
                          className="w-14 h-14 text-2xl"
                        >

                          +

                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeItem(
                            item.id
                          )
                        }
                        className="text-red-500 font-bold "
                      >

                        حذف

                      </button>

                    </div>
</div>
                  </div>

                </div>
              )
            )}

          </div>

          {/* TOTAL */}
          {cart.length > 0 && (

            <>

              <div className="mt-10 border rounded-[30px] p-6">

                <h3 className="text-3xl font-black mb-6">

                  ملخص الطلب

                </h3>

                {/* SUBTOTAL */}
                <div className="flex justify-between mb-4 text-lg">

                  <span>

                    المجموع الفرعي

                  </span>

                  <span>

                    {subtotal}
                    {" "}
                    د.ت

                  </span>

                </div>

                {/* DELIVERY */}
                <div className="flex justify-between mb-4 text-lg text-gray-500">

                  <span>
                    التوصيل
                  </span>

                  <span>

                    {delivery}
                    {" "}
                    د.ت

                  </span>

                </div>

                {/* TOTAL */}
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

              {/* CHECKOUT FORM */}
              <div className="mt-10 border-2 border-dashed border-indigo-500 rounded-[30px] p-5">

                <h2 className="text-3xl font-black mb-8">

                  معلومات الطلب

                </h2>

                {/* NAME */}
                <div className="mb-5">

                  <input
                    type="text"
                    placeholder="الاسم واللقب"
                    value={
                      clientName
                    }
                    onChange={(e) =>
                      setClientName(
                        e.target
                          .value
                      )
                    }
                    className={`w-full h-14 border-2 rounded-2xl px-5 text-right ${
                      errors.clientName
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                </div>

                {/* PHONE */}
                <div className="mb-5">

                  <input
                    type="text"
                    placeholder="الهاتف"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target
                          .value
                      )
                    }
                    className={`w-full h-14 border-2 rounded-2xl px-5 text-right ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                </div>

                {/* ADDRESS */}
                <div className="mb-5">

                  <input
                    type="text"
                    placeholder="العنوان"
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target
                          .value
                      )
                    }
                    className={`w-full h-14 border-2 rounded-2xl px-5 text-right ${
                      errors.address
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  />

                </div>

                {/* CITY */}
                <div className="mb-6">

                  <select
                    value={city}
                    onChange={(e) =>
                      setCity(
                        e.target
                          .value
                      )
                    }
                    className={`w-full h-14 border-2 rounded-2xl px-5 text-right bg-white ${
                      errors.city
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >

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

                {/* BUTTON */}
                <button
                  onClick={
                    handleOrder
                  }
                  className="w-full bg-indigo-900 text-white h-16 rounded-2xl text-2xl font-black"
                >

                  اشترِ الآن 🛒

                </button>

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
}