"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GuestLayout from "@/components/layout/GuestLayout";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      router.push("/rooms");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <GuestLayout>
      <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </GuestLayout>
  );
}
