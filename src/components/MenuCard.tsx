"use client";

import { Menu } from "@/types/Menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CartItem = {
  id: string;
  qty: number;
};

type MenuListProps = {
  menu: Menu[];
  loading: boolean;
  addToCart: (item: Menu) => void;
  removeFromCart: (item: Menu) => void;
  cart: CartItem[];
};

export const MenuCard = ({
  menu,
  loading,
  addToCart,
  removeFromCart,
  cart,
}: MenuListProps) => {
  if (loading) {
    return (
      <div className="px-4 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="h-48 sm:h-60 bg-gray-300 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {menu.map((item) => {
        const currentQty = cart.find((c) => c.id === item.id)?.qty || 0;

        return (
          <Card
            key={item.id}
            className="bg-white text-black p-3 sm:p-4 rounded-xl shadow flex flex-col justify-between hover:shadow-md transition-all duration-200"
          >
            {/* Gambar produk */}
            <div>
              <div className="w-full aspect-square overflow-hidden rounded-lg">
                <img
                  src={item.image_url || ""}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nama & deskripsi */}
              <h3 className="font-semibold mt-3 text-sm sm:text-base line-clamp-1 sm:line-clamp-2">
                {item.name}
              </h3>
              <p className="text-[12px] sm:text-[13px] text-gray-600 mt-1 text-justify line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Harga + Tombol qty */}
            <div className="flex items-center justify-between mt-3 sm:mt-4">
              <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                Rp {item.price.toLocaleString()}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md text-base sm:text-lg bg-gray-100 text-black hover:bg-gray-200"
                  onClick={() => removeFromCart(item)}
                >
                  -
                </Button>

                {/* Jumlah item */}
                <span className="text-sm font-medium min-w-[20px] text-center">
                  {currentQty}
                </span>

                <Button
                  size="icon"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-md text-base sm:text-lg bg-black text-white hover:bg-gray-800"
                  onClick={() => addToCart(item)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Tombol hapus */}
            {currentQty > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="mt-3 bg-red-600 hover:bg-red-700 text-white w-full text-sm sm:text-[15px]"
                onClick={() => {
                  for (let i = 0; i < currentQty; i++) removeFromCart(item);
                }}
              >
                Hapus dari Keranjang
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
};
