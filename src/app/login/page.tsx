"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !tableNumber) {
      alert("Nama dan nomor meja wajib diisi");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("customers")
      .insert([{ username, table_number: tableNumber }]);

    if (error) {
      alert("Gagal menyimpan pelanggan");
      setLoading(false);
      return;
    }

    // ✅ Simpan ke localStorage supaya terbaca di halaman lain
    localStorage.setItem("customer_name", username);
    localStorage.setItem("table_number", tableNumber);

    // ✅ Redirect ke halaman utama (home) dengan query parameter
    router.push(`/?username=${encodeURIComponent(username)}&table=${encodeURIComponent(tableNumber)}`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0C2B4E]">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h1 className="text-xl font-semibold text-center mb-4 text-[#0C2B4E]">
          Neeto Café
        </h1>

        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Nama kamu"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-2 border rounded mb-3"
          placeholder="Nomor meja"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-2 text-white"
          style={{ backgroundColor: "#0C2B4E" }}
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>
    </main>
  );
}
