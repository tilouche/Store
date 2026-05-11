import { useState } from "react";
import { adminLogin } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
console.log(email, password);
const handleLogin = async () => {
  try {
    const data = await adminLogin(
      "admin@test.com",   // حط email الصحيح
      "12345678"          // حط password الصحيح
    );

    console.log("SUCCESS 👉", data);
    alert("✅ Login success");
  } catch (err) {
    console.log("ERROR 👉", err);
    alert("❌ " + err.message);
  }
};

  return (
    <div style={{ padding: 50 }}>
      <h1>Admin Login</h1>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}