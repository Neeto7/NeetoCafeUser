  export type OrderItem = {
    id: string;                 // uuid
    order_id: string;           // FK -> orders.id
    menu_id: number;            // bigint (from menu.id)
    name: string;
    price: number;
    qty: number;
    created_at: string;         // timestamp
  };
