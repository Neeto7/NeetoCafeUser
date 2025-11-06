"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartDrawerProps = {
  cart: CartItem[];
  total: number;
  onClose: () => void;
};

export const CartDrawer = ({ cart, total, onClose }: CartDrawerProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const username = searchParams.get("username");
  const table = searchParams.get("table");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    setLoading(true);

    // Simpan order ke Supabase
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: username,
        table_number: table,
        total_price: total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error(orderError);
      setLoading(false);
      return alert("Gagal menyimpan pesanan!");
    }

    // Simpan order items
    const orderItems = cart.map((item) => ({
      order_id: orderData.id,
      menu_id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
    }));

    const { error: itemError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemError) {
      console.error(itemError);
      setLoading(false);
      return alert("Gagal menyimpan item pesanan!");
    }

    // ✅ Simpan data ke localStorage untuk halaman pembayaran
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cart_total", total.toString());
    localStorage.setItem("table_number", table || "");
    localStorage.setItem("username", username || "");

    setLoading(false);

    // ✅ Redirect ke halaman pembayaran
    router.push(`/payment?order_id=${orderData.id}&table=${table}&username=${username}`);

  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-end">
      <div className="bg-white text-black w-full p-6 rounded-t-2xl max-h-[70vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Keranjang Anda</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} <span className="text-xs">x{item.qty}</span>
            </span>
            <span>Rp {(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}

        <p className="font-semibold mt-4">
          Total: Rp {total.toLocaleString()}
        </p>

        <Button
          className="w-full bg-[#0C2B4E] hover:bg-[#1D546C] text-white mt-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Kirim Pesanan"}
        </Button>

        <Button className="w-full mt-2" variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </div>
  );
};
