export default function CartDrawer({
  open,
  setOpen,
  cart,
  setCart,
  setCheckoutOpen,
}) {

  // ============================
  // TOTAL
  // ============================

  const subtotal = cart.reduce(
    (acc, item) =>
      acc +
      item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0
    ? 8
    : 0;

  const total =
    subtotal + delivery;

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
  };

  // ============================
  // REMOVE ITEM
  // ============================

  const removeItem = (id) => {

    const updated =
      cart.filter(
        (item) =>
          item.id !== id
      );

    setCart(updated);
  };

  // ============================
  // CLOSE
  // ============================

  if (!open) return null;

  // ============================
  // UI
  // ============================

  return (

    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">

      <div className="bg-white w-full sm:max-w-lg h-screen p-6 overflow-y-auto animate-slide-left">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-black">
            🛒 Your Cart
          </h2>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="text-2xl"
          >
            ✖
          </button>

        </div>

        {/* EMPTY */}
        {cart.length === 0 && (

          <div className="text-center mt-20">

            <h3 className="text-2xl font-bold">
              Cart is empty
            </h3>

            <p className="text-gray-400 mt-3">
              Add some products 🛍
            </p>

          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-5">

          {cart.map((item,index) => (

            <div
             key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                className="flex flex-col sm:flex-row gap-4 border rounded-3xl p-4"
              >

              {/* IMAGE */}
              <img
                src={item.image}
                alt=""
                className="w-full sm:w-28 h-56 sm:h-28 object-cover rounded-2xl"
                />

              {/* INFO */}
              <div className="flex-1">

                <h3 className="font-black text-lg">
                  {item.name}
                </h3>

                {/* SIZE */}
                {item.selectedSize && (
                  <p className="text-sm text-gray-500 mt-1">
                    Size:
                    {" "}
                    {item.selectedSize}
                  </p>
                )}

                {/* COLOR */}
                {item.selectedColor && (
                  <p className="text-sm text-gray-500">
                    Color:
                    {" "}
                    {item.selectedColor}
                  </p>
                )}

                <p className="text-green-600 font-black mt-2">
                  {item.price} DT
                </p>

                {/* QUANTITY */}
                <div className="flex items-center gap-3 mt-4">

                  <button
                    onClick={() =>
                      decreaseQty(
                        item.id
                      )
                    }
                    className="w-9 h-9 rounded-full bg-gray-100"
                  >
                    -
                  </button>

                  <span className="font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(
                        item.id
                      )
                    }
                    className="w-9 h-9 rounded-full bg-black text-white"
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
                  className="mt-4 text-red-500 text-sm"
                >
                  Remove
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* TOTALS */}
        {cart.length > 0 && (

          <div className="mt-10 border-t pt-6">

            <div className="flex justify-between mb-3">

              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-bold">
                {subtotal} DT
              </span>

            </div>

            <div className="flex justify-between mb-3">

              <span className="text-gray-500">
                Delivery
              </span>

              <span className="font-bold">
                {delivery} DT
              </span>

            </div>

            <div className="flex justify-between text-2xl font-black">

              <span>Total</span>

              <span>
                {total} DT
              </span>

            </div>

            {/* CHECKOUT */}
            <button
              onClick={() => {

                setCheckoutOpen(
                  true
                );

                setOpen(false);
              }}
              className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-5 rounded-3xl text-lg font-black transition"
            >

              Checkout

            </button>

          </div>
        )}

      </div>
    </div>
  );
}