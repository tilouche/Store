import { useState, useEffect } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ProductModal from "../components/ProductModal";
import OrderDetailsModal from "../components/OrderDetailsModal";
import notificationMp3 from "../assets/notification.wav";

import {
  adminLogin,
  adminLogout,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  subscribeToOrders,
  getProducts,
  addProduct,
  deleteProduct,
} from "../services/supabase";

export default function Admin() {

  // ============================
  // STATES
  // ============================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");
    const [orderTab, setOrderTab] =
  useState("nouveau");

  const [orders, setOrders] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [activePage, setActivePage] =
    useState("orders");

  const [
    openProductModal,
    setOpenProductModal,
  ] = useState(false);

  const [orderFilter, setOrderFilter] =
  useState("nouveau");

  const [selectedOrder, setSelectedOrder] =
  useState(null);

const [openOrderModal, setOpenOrderModal] =
  useState(false);

  const [notifications, setNotifications] =
  useState([]);

const [showNotifications, setShowNotifications] =
  useState(false);

  const notificationAudio =
  useRef(null);
  const audio =
  new Audio(
    notificationMp3
  );
  // ============================
  // LOGIN
  // ============================

  const handleLogin = async () => {

    setLoading(true);

    try {

      const data =
        await adminLogin(
          email,
          password
        );

      setUser(data.user);

      toast.success(
        "✅ Login success"
      );

    } catch (err) {

      toast.error(
        err.message
      );

    } finally {

      setLoading(false);
    }
  };

  const handleLogout = async () => {

    await adminLogout();

    setUser(null);
  };

  // ============================
  // ORDERS
  // ============================

const fetchOrders =
  async () => {

    const data =
      await getOrders();

    const sorted =
      data.sort(
        (a, b) =>

          new Date(
            b.created_at ||
            0
          ) -

          new Date(
            a.created_at ||
            0
          )
      );

    setOrders(
      [...sorted]
    );
  };
  const handleStatus =
    async (id, status) => {

      await updateOrderStatus(
        id,
        status
      );

      fetchOrders();

      toast.success(
        "✅ Status updated"
      );
    };

  const handleDelete =
    async (id) => {

      await deleteOrder(id);

      fetchOrders();

      toast.success(
        "🗑 Order deleted"
      );
    };

  // ============================
  // PRODUCTS
  // ============================

  const fetchProducts =
    async () => {

      const data =
        await getProducts();

      setProducts(data || []);
    };

  const handleAddProduct =
    async (productData) => {

      await addProduct(
        productData
      );

      fetchProducts();

      toast.success(
        "🛍 Product added"
      );
    };

  const handleDeleteProduct =
    async (id) => {

      await deleteProduct(id);

      fetchProducts();

      toast.success(
        "🗑 Product deleted"
      );
    };

  // ============================
  // REALTIME
  // ============================

  useEffect(() => {

    if (!user) return;

    fetchOrders();
    fetchProducts();

    const channel =
  subscribeToOrders(
    async (payload) => {

      console.log(
        "REALTIME 👉",
        payload
      );

      // ONLY INSERT
    if (
  payload.eventType ===
  "INSERT"
) {

  audio.currentTime = 0;

  audio.play().catch(
    (err) => {
      console.log(err);
    }
  );

  toast.success(
    "🆕 New Order"
  );

  setNotifications(
    (prev) => [

      {
        id: Date.now(),

        text:
          `🛒 New order from ${payload.new.client_name}`,

        time:
          new Date().toLocaleTimeString(),

        read: false,
      },

      ...prev,
    ]
  );
}

      // REFRESH
      await fetchOrders();
    }
  );

    return () => {
      channel.unsubscribe();
    };

  }, [user]);

  // ============================
  // LOGIN PAGE
  // ============================

  if (!user) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">

          <h1 className="text-4xl font-black mb-6">
            🔐 Admin Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl mb-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold"
          >

            {loading
              ? "Loading..."
              : "Login"}

          </button>

        </div>
      </div>
    );
  }

  // ============================
  // DASHBOARD
  // ============================

  return (

        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
        handleLogout={
          handleLogout
        }
      />

      <div className="flex-1 p-6">

       <Navbar
  search={search}
  setSearch={setSearch}

  notifications={notifications}

  showNotifications={
    showNotifications
  }

  setShowNotifications={
    setShowNotifications
  }
/>

        <StatsCard
          orders={orders}
          products={products}
        />

        {/* ORDERS */}
        {activePage ===
          "orders" && (

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-3xl font-black mb-6">
              📦 Orders
            </h2>

           <div className="flex gap-3 overflow-x-auto mb-6">

  {[
    "tous",
    "nouveau",
    "confirmé",
    "expédié",
    "livré",
    "annulé",
  ].map((status) => (

    <button
      key={status}
      onClick={() =>
        setOrderFilter(
          status
        )
      }
      className={`px-5 py-3 rounded-2xl whitespace-nowrap transition font-bold ${
        orderFilter ===
        status
          ? "bg-black text-white"
          : "bg-gray-100"
      }`}
    >

      {status}

      {" "}

      (

      {status ===
      "tous"

        ? orders.length

        : orders.filter(
            (o) =>
              o.status ===
              status
          ).length}

      )

    </button>
  ))}

</div>



            <div className="space-y-4">

              {orders

 .filter((o) =>

  orderFilter ===
  "tous"

    ? true

    : o.status ===
      orderFilter
)
.sort(
  (a, b) =>
    b.id.localeCompare(a.id)
)

  .filter((o) =>
    o.client_name
      ?.toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )
                .map((o) => (

                  <div
                    key={o.id}
                    onClick={() => {

                    setSelectedOrder(o);

                    setOpenOrderModal(true);
                    }}
                    className="border p-5 rounded-2xl"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-bold text-xl">
                          {o.client_name}
                        </h3>

                        <p>{o.phone}</p>

                        <p className="text-gray-400 text-sm">
                          {o.address}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-black text-green-600 text-xl">
                          {o.total} DT
                        </p>

                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatus(
                              o.id,
                              e.target.value
                            )
                          }
                          className="mt-2 bg-gray-100 px-3 py-2 rounded-xl"
                        >

                          <option>
                            nouveau
                          </option>

                          <option>
                            confirmé
                          </option>

                          <option>
                            expédié
                          </option>

                          <option>
                            livré
                          </option>

                          <option>
                            annulé
                          </option>

                        </select>

                      </div>

                    </div>

                    {/* ITEMS */}
                    <div className="mt-5 space-y-3">

                      {o.items?.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={index}
                            className="bg-gray-100 rounded-2xl p-4"
                          >

                            <div className="flex justify-between">

                              <p className="font-bold">
                                {item.name}
                              </p>

                              <p className="font-bold text-green-600">
                                {item.price} DT
                              </p>

                            </div>

                            <p className="text-sm text-gray-500 mt-1">

                              Quantity:
                              {" "}
                              {item.quantity}

                            </p>

                            <p className="text-sm text-gray-500">

                              Size:
                              {" "}
                              {item.selectedSize || "-"}

                            </p>

                            <p className="text-sm text-gray-500">

                              Color:
                              {" "}
                              {item.selectedColor || "-"}

                            </p>

                          </div>
                        )
                      )}

                    </div>

                    <button
                      onClick={() =>
                        handleDelete(
                          o.id
                        )
                      }
                      className="mt-4 text-red-500"
                    >
                      Delete
                    </button>

                  </div>
                ))}

            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activePage ===
          "products" && (

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <div className="flex flex-col md:flex-row md:justify-between gap-5">

              <h2 className="text-3xl font-black">
                🛍 Products
              </h2>

              <button
                onClick={() =>
                  setOpenProductModal(
                    true
                  )
                }
                className="bg-black text-white px-5 py-3 rounded-2xl"
              >
                ➕ Add Product
              </button>

            </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (

                <div
                  key={p.id}
                  className="border rounded-3xl overflow-hidden"
                >

                  <img
                    src={
                      p.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt=""
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">

                    <h3 className="font-bold text-xl">
                      {p.name}
                    </h3>

                    <p className="text-green-600 font-black mt-2">
                      {p.price} DT
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Stock:
                      {" "}
                      {p.stock}
                    </p>

                    {/* SIZES */}
                    <div className="flex gap-2 mt-3 flex-wrap">

                      {(Array.isArray(p.sizes)
                        ? p.sizes
                        : typeof p.sizes === "string"
                        ? p.sizes
                            .replaceAll("[", "")
                            .replaceAll("]", "")
                            .replaceAll('"', "")
                            .split(",")
                        : []
                      ).map((size) => (

                        <span
                          key={size}
                          className="bg-gray-100 px-3 py-1 rounded-xl text-sm"
                        >

                          {size.trim()}

                        </span>
                      ))}

                    </div>

                    {/* COLORS */}
                    <div className="flex gap-2 mt-3 flex-wrap">

                      {(Array.isArray(p.colors)
                        ? p.colors
                        : typeof p.colors === "string"
                        ? p.colors
                            .replaceAll("[", "")
                            .replaceAll("]", "")
                            .replaceAll('"', "")
                            .split(",")
                        : []
                      ).map((color) => (

                        <span
                          key={color}
                          className="bg-black text-white px-3 py-1 rounded-xl text-sm"
                        >

                          {color.trim()}

                        </span>
                      ))}

                    </div>

                    <button
                      onClick={() =>
                        handleDeleteProduct(
                          p.id
                        )
                      }
                      className="mt-5 w-full bg-red-50 text-red-500 py-3 rounded-2xl"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

        <ProductModal
          open={openProductModal}
          setOpen={
            setOpenProductModal
          }
          onAdd={handleAddProduct}
        />

        <OrderDetailsModal
            open={openOrderModal}
            setOpen={setOpenOrderModal}
            order={selectedOrder}
            />

        

      </div>
    </div>
  );
}