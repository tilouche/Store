export default function OrderDetailsModal({
  open,
  setOpen,
  order,
}) {

  if (!open || !order)
    return null;

  return (

    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-3xl rounded-[40px] p-8 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-4xl font-black">
              📦 Order Details
            </h2>

            <p className="text-gray-400 mt-2">
              #{order.id}
            </p>

          </div>

          <button
            onClick={() =>
              setOpen(false)
            }
            className="text-3xl"
          >
            ✖
          </button>

        </div>

        {/* CLIENT */}
        <div className="bg-gray-100 rounded-3xl p-6 mb-8">

          <h3 className="text-2xl font-black mb-4">
            👤 Client
          </h3>

          <div className="space-y-2">

            <p>
              <span className="font-bold">
                Name:
              </span>
              {" "}
              {order.client_name}
            </p>

            <p>
              <span className="font-bold">
                Phone:
              </span>
              {" "}
              {order.phone}
            </p>

            <p>
              <span className="font-bold">
                Address:
              </span>
              {" "}
              {order.address}
            </p>

            <p>
              <span className="font-bold">
                Status:
              </span>
              {" "}
              {order.status}
            </p>

          </div>

        </div>

        {/* PRODUCTS */}
        <div>

          <h3 className="text-2xl font-black mb-5">
            🛍 Products
          </h3>

          <div className="space-y-4">

            {order.items?.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className="border rounded-3xl p-5 flex flex-col sm:flex-row gap-5"
                >

                  {/* IMAGE */}
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt=""
                    className="w-full sm:w-28 h-56 sm:h-28 object-cover rounded-2xl"
                  />

                  {/* INFO */}
                  <div className="flex-1">

                    <h4 className="text-xl font-black">
                      {item.name}
                    </h4>

                    <p className="text-green-600 font-black mt-2">
                      {item.price} DT
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-500">

                      <p>
                        Quantity:
                        {" "}
                        {item.quantity}
                      </p>

                      <p>
                        Size:
                        {" "}
                        {item.selectedSize || "-"}
                      </p>

                      <p>
                        Color:
                        {" "}
                        {item.selectedColor || "-"}
                      </p>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* TOTAL */}
        <div className="mt-8 border-t pt-6 flex justify-between items-center">

          <h3 className="text-3xl font-black">
            Total
          </h3>

          <p className="text-4xl font-black text-green-600">

            {order.total} DT

          </p>

        </div>

      </div>

    </div>
  );
}