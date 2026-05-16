import { useState, useEffect, useRef } from "react";

import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ProductModal from "../components/ProductModal";
import OrderDetailsModal from "../components/OrderDetailsModal";

import notificationMp3 from "../assets/notification.wav";

import {
  supabase,
  adminLogin,
  adminLogout,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  subscribeToOrders,
  getProducts,
  addProduct,
  deleteProduct,
  getLiveCustomers,
  deleteLiveClient,
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

  const [orders, setOrders] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [activePage, setActivePage] =
    useState("orders");

  const [openProductModal,
  setOpenProductModal] =
    useState(false);

  const [orderFilter,
  setOrderFilter] =
    useState("nouveau");

  const [selectedOrder,
  setSelectedOrder] =
    useState(null);

  const [openOrderModal,
  setOpenOrderModal] =
    useState(false);

  const [notifications,
  setNotifications] =
    useState([]);

  const [showNotifications,
  setShowNotifications] =
    useState(false);

  const [liveClients,
  setLiveClients] =
    useState([]);

  const audioRef =
    useRef(null);
    const [showLiveClients,
setShowLiveClients] =
  useState(true);

  // ============================
  // LOGIN
  // ============================

  const handleLogin =
    async () => {

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

  const handleLogout =
    async () => {

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
    const fetchLiveClients =
  async () => {

    const data =
      await getLiveCustomers();

    setLiveClients(
      data || []
    );
  };
  const handleDeleteLiveClient =
  async (id) => {

    await deleteLiveClient(
      id
    );

    setLiveClients(
      (prev) =>

        prev.filter(
          (c) =>
            c.id !== id
        )
    );

    toast.success(
      "🗑 Client deleted"
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
    fetchLiveClients();

    fetchOrders();

    fetchProducts();

    // =========================
    // ORDERS REALTIME
    // =========================

    const channel =
      subscribeToOrders(

        async (payload) => {

          console.log(
            "REALTIME 👉",
            payload
          );

          if (
            payload.eventType ===
            "INSERT"
          ) {

            const audio =
              new Audio(
                notificationMp3
              );

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

          await fetchOrders();
        }
      );

    // =========================
    // LIVE CLIENTS
    // =========================

    const liveChannel =
      supabase

        .channel(
          "realtime-live"
        )

        .on(
          "postgres_changes",

          {
            event: "INSERT",

            schema: "public",

            table:
              "live_customers",
          },

          (payload) => {

            console.log(
              "LIVE RECEIVED 👉",
              payload
            );

            toast.success(
              "📲 Client en cours"
            );

            const audio =
              new Audio(
                notificationMp3
              );

            audio.play();

            setLiveClients(
              (prev) => [

                payload.new,

                ...prev,
              ]
            );
          }
        )

        .subscribe();

    // =========================
    // CLEANUP
    // =========================

    return () => {

      channel.unsubscribe();

      supabase.removeChannel(
        liveChannel
      );
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

      {/* SIDEBAR */}
      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
        handleLogout={
          handleLogout
        }
      />

      {/* CONTENT */}
      <div className="flex-1 p-6">

        {/* NAVBAR */}
        <Navbar
          search={search}
          setSearch={setSearch}

          notifications={
            notifications
          }

          showNotifications={
            showNotifications
          }

          setShowNotifications={
            setShowNotifications
          }
        />

        {/* STATS */}
        <StatsCard
          orders={orders}
          products={products}
        />

       {/* LIVE CLIENTS */}
<div className="bg-white rounded-3xl p-6 shadow-sm mb-6">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-6">

    <h2 className="text-3xl font-black">

      🔥 Clients En Cours

    </h2>

    <button
      onClick={() =>
        setShowLiveClients(
          !showLiveClients
        )
      }
      className="bg-black text-white px-5 py-3 rounded-2xl"
    >

      {showLiveClients
        ? "Hide"
        : "Show"}

    </button>

  </div>

  {/* LIST */}
  {showLiveClients && (

    <div className="space-y-4">

      {liveClients.map(
        (client) => (

          <div
            key={client.id}
            className="border rounded-2xl p-4 flex justify-between items-center"
          >

            {/* INFO */}
            <div>

              <p className="font-black">

                {
                  client.client_name ||
                  "Client"
                }

              </p>

              <p className="text-gray-500">

                {client.phone}

              </p>

              <p className="text-sm text-gray-400 mt-1">

                {
                  client.product_name
                }

              </p>

            </div>

            {/* DELETE */}
            <button
              onClick={() =>
                handleDeleteLiveClient(
                  client.id
                )
              }
              className="bg-red-50 text-red-500 px-4 py-2 rounded-xl"
            >

              Delete

            </button>

          </div>
        )
      )}

    </div>
  )}

</div>

        {/* ORDERS */}
        {activePage ===
          "orders" && (

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-3xl font-black mb-6">

              📦 Orders

            </h2>

            {/* FILTERS */}
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

            {/* LIST */}
            <div className="space-y-4">

              {orders

                .filter((o) =>

                  orderFilter ===
                  "tous"

                    ? true

                    : o.status ===
                      orderFilter
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
                    className="border rounded-3xl p-5"
                  >

                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-5">

                      {/* CLIENT */}
                      <div>

                        <h3 className="font-black text-2xl">

                          {
                            o.client_name
                          }

                        </h3>

                        <p className="mt-2">

                          📞 {o.phone}

                        </p>

                        <p className="text-gray-500 mt-2">

                          📍 {o.address}

                        </p>

                      </div>

                      {/* STATUS */}
                      <div className="md:text-right">

                        <p className="text-3xl font-black text-green-600">

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
                          className="mt-3 bg-gray-100 px-4 py-3 rounded-2xl"
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

                    {/* BUTTONS */}
                    <div className="flex gap-3 mt-6">

                      {/* DETAILS */}
                      <button
                        onClick={() => {

                          setSelectedOrder(
                            o
                          );

                          setOpenOrderModal(
                            true
                          );
                        }}
                        className="bg-black text-white px-5 py-3 rounded-2xl"
                      >

                        Order Details

                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDelete(
                            o.id
                          )
                        }
                        className="bg-red-50 text-red-500 px-5 py-3 rounded-2xl"
                      >

                        Delete

                      </button>

                    </div>

                  </div>
                ))}

            </div>

          </div>
        )}

        {/* PRODUCTS */}
        {activePage ===
          "products" && (

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            {/* TOP */}
            <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-8">

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

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {products.map((p) => (

                <div
                  key={p.id}
                  className="border rounded-3xl overflow-hidden"
                >

                  {/* IMAGE */}
                  <img
                    src={
                      p.image ||
                      "https://via.placeholder.com/300"
                    }
                    alt=""
                    className="w-full h-56 object-cover"
                  />

                  {/* CONTENT */}
                  <div className="p-5">

                    <h3 className="font-black text-2xl">

                      {p.name}

                    </h3>

                    <p className="text-green-600 font-black text-2xl mt-3">

                      {p.price} DT

                    </p>

                    <p className="text-gray-400 mt-2">

                      Stock:
                      {" "}
                      {p.stock}

                    </p>

                    {/* SIZES */}
                    <div className="flex gap-2 mt-4 flex-wrap">

                      {(Array.isArray(
                        p.sizes
                      )

                        ? p.sizes

                        : typeof p.sizes ===
                          "string"

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
                    <div className="flex gap-2 mt-4 flex-wrap">

                      {(Array.isArray(
                        p.colors
                      )

                        ? p.colors

                        : typeof p.colors ===
                          "string"

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

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDeleteProduct(
                          p.id
                        )
                      }
                      className="mt-6 w-full bg-red-50 text-red-500 py-4 rounded-2xl"
                    >

                      Delete

                    </button>

                  </div>

                </div>
              ))}

            </div>

          </div>
        )}

        {/* PRODUCT MODAL */}
        <ProductModal
          open={openProductModal}
          setOpen={
            setOpenProductModal
          }
          onAdd={handleAddProduct}
        />

        {/* ORDER DETAILS */}
        <OrderDetailsModal
          open={openOrderModal}
          setOpen={
            setOpenOrderModal
          }
          order={selectedOrder}
        />

      </div>

    </div>
  );
}