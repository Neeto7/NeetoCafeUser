"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash" | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const totalData = localStorage.getItem("cart_total");
    const table = searchParams.get("table");
    const name = localStorage.getItem("customer_name");

    if (cartData) setCart(JSON.parse(cartData));
    if (totalData) setTotal(Number(totalData));
    if (table) setTableNumber(table);
    if (name) setCustomerName(name);
  }, [searchParams]);

  const handleConfirm = async () => {
    if (!paymentMethod) return alert("Pilih metode pembayaran dulu!");

    if (!tableNumber || !customerName || cart.length === 0) {
      alert("Data tidak lengkap. Silakan kembali ke menu.");
      return;
    }

    setLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: customerName,
            table_number: tableNumber,
            total_price: total,
            status: paymentMethod === "cash" ? "pending" : "completed",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        menu_id: Number(item.id),
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const { error: itemError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemError) throw itemError;

      setSuccess(true);
      localStorage.removeItem("cart");
      localStorage.removeItem("cart_total");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan pesanan!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tampilan setelah sukses
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C2B4E] text-white px-6 text-center">
        <h2 className="text-2xl font-bold mb-3">Pesanan Berhasil!</h2>
        <p className="text-gray-200 mb-6">
          {paymentMethod === "cash"
            ? "Silakan ke kasir untuk melakukan pembayaran."
            : "Pembayaran berhasil melalui QRIS."}
        </p>
        <Button
          className="bg-white text-[#0C2B4E] hover:bg-[#1A3D64]"
          onClick={() => router.push("/login")}
        >
          Kembali ke Menu
        </Button>
      </div>
    );
  }

  // ✅ Tampilan utama
  return (
    <div className="min-h-screen bg-[#0C2B4E] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Pembayaran Meja {tableNumber ?? "-"}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Ringkasan Pesanan */}
          <div>
            <h2 className="font-semibold text-lg text-[#0C2B4E] mb-3">
              Ringkasan Pesanan
            </h2>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm border-b border-gray-200 pb-2 mb-2"
              >
                <span>
                  {item.name} ×{item.qty}
                </span>
                <span className="font-medium">
                  Rp {(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
            <p className="font-semibold text-right text-[#0C2B4E] text-lg mt-3">
              Total: Rp {total.toLocaleString()}
            </p>
          </div>

          {/* Metode Pembayaran */}
          <div>
            <h2 className="font-semibold text-lg text-[#0C2B4E] mb-3">
              Pilih Metode Pembayaran
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                className={`w-full border ${
                  paymentMethod === "qris"
                    ? "bg-[#0C2B4E] text-white"
                    : "bg-[#0C2B4E] border-white text-white hover:bg-[#1A3D64] "
                }`}
                onClick={() => setPaymentMethod("qris")}
              >
                QRIS
              </Button>

              <Button
                className={`w-full border ${
                  paymentMethod === "cash"
                    ? "bg-[#0C2B4E] text-white"
                    : "bg-[#0C2B4E] border-white text-white hover:bg-[#1A3D64] "
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                Tunai
              </Button>
            </div>

            {paymentMethod === "qris" && (
              <div className="mt-6 text-center">
                <h3 className="font-semibold text-[#0C2B4E] mb-2">
                  Scan QRIS untuk membayar
                </h3>
                <div className="w-52 h-52 mx-auto border-2 border-[#0C2B4E] rounded-lg overflow-hidden">
                  <Image
                    src="/qris.png"
                    alt="QRIS"
                    width={208}
                    height={208}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "cash" && (
              <p className="text-center mt-6 text-gray-600 text-sm">
                💬 Silakan ke kasir untuk melakukan pembayaran.
              </p>
            )}
          </div>

          {/* Tombol Konfirmasi */}
          <Button
            className="w-full bg-[#1D546C] text-white hover:bg-[#1A3D64] mt-4"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Konfirmasi Pembayaran"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-white">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
