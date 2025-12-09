  export type Order = {
    id: string;                 // uuid
    customer_id: string | null; // FK -> customers.id
    customer_name: string | null;
    table_number: string;
    total_price: number;
    status: "pending" | "processing" | "completed";
    created_at: string;         // timestamp
  };
