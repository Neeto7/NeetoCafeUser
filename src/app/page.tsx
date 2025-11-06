"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { HeaderVideo } from "@/components/HeaderVideo";
import { MenuCard } from "@/components/MenuCard";
import { CartButton } from "@/components/CartButton";
import { CartDrawer } from "@/components/CartDrawer";
import type { Menu } from "@/types/Menu";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

function HomePageContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const table = searchParams.get("table");

  const [menu, setMenu] = useState<Menu[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      const { data, error } = await supabase
        .from("menu")
        .select("*")
        .eq("is_available", true);
      if (!error && data) setMenu(data);
      setLoadingMenu(false);
    };
    loadMenu();
  }, []);

  const addToCart = (item: Menu) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (item: Menu) => {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (!found) return prev;
      if (found.qty === 1) return prev.filter((c) => c.id !== item.id);
      return prev.map((c) =>
        c.id === item.id ? { ...c, qty: c.qty - 1 } : c
      );
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSubmit = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    const { error } = await supabase.from("orders").insert({
      customer_name: username,
      table_number: table,
      total_price: total,
      status: "pending",
    });
    if (error) return alert("Gagal mengirim pesanan!");
    alert("Pesanan berhasil dikirim!");
    setCart([]);
    setShowCart(false);
  };

  return (
    <main className="bg-[#0C2B4E] min-h-screen">
      <HeaderVideo username={username} table={table} />

      <MenuCard
        menu={menu}
        loading={loadingMenu}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        cart={cart}
      />

      <CartButton
        itemCount={cart.length}
        total={total}
        onOpen={() => setShowCart(true)}
      />

      {showCart && (
        <CartDrawer
          cart={cart}
          total={total}
          onClose={() => setShowCart(false)}
        />
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
