import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log("URL 👉", supabaseUrl);
console.log("KEY 👉", supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
// 🔐 LOGIN
export const adminLogin = async (email, password) => {
  console.log("LOGIN TRY 👉", email, password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("RESULT 👉", data, error);

  if (error) throw error;

  return data;
};
export const addTestOrder = async () => {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        client_name: "Test Ahmed",
        phone: "12345678",
        address: "Tunis",
        total: 99,
        status: "nouveau",
      },
    ])
    .select();

  console.log("DATA 👉", data);
  console.log("ERROR 👉", error);
};
// 🔴 REALTIME ORDERS


// 🚪 LOGOUT
export const adminLogout = async () => {
  await supabase.auth.signOut();
};
// 📦 GET ORDERS

export const getOrders = async () => {

  const { data, error } =
    await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  console.log(
    "ORDERS 👉",
    data
  );

  console.log(
    "ERROR 👉",
    error
  );

  if (error) {
    throw error;
  }

  return data;
};

export const createOrder =
  async (orderData) => {

    const { data, error } =
      await supabase
        .from("orders")
        .insert([orderData])
        .select();

    if (error) {
      throw error;
    }

    return data;
};

export const updateOrderStatus =
  async (id, status) => {

    const { data, error } =
      await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

    if (error) {
      throw error;
    }

    return data;
};

export const deleteOrder =
  async (id) => {

    const { data, error } =
      await supabase
        .from("orders")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }

    return data;
};

export const subscribeToOrders =
  (callback) => {

    return supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        callback
      )
      .subscribe();
};
// 🔄 UPDATE STATUS

// =======================
// PRODUCTS
// =======================

// 📦 GET PRODUCTS
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};
export const getProductById =
  async (id) => {

    const { data, error } =
      await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw error;
    }

    return data;
};

// ➕ ADD PRODUCT
export const addProduct =
  async (product) => {

    const { data, error } =
      await supabase
        .from("products")
        .insert([product])
        .select();

    console.log(
      "PRODUCT 👉",
      data
    );

    console.log(
      "ERROR 👉",
      error
    );

    if (error) throw error;

    return data;
  };
export const uploadImage =
  async (file) => {

    const fileName =
      `${Date.now()}-${file.name}`;

    const { error } =
      await supabase.storage
        .from("products")
        .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return publicUrl;
  };
// ✏️ UPDATE PRODUCT
export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data[0];
};

// 🗑 DELETE PRODUCT
export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
};