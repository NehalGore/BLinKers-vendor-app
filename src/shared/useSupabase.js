import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const VENDOR_ID = "00000000-0000-0000-0000-000000000001";

// ── Fetch products with stock ─────────────────────────────────────
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("vendor_products")
        .select(`
          vendor_product_id,
          price,
          physical_stock,
          safety_stock,
          reorder_point,
          avg_daily_sales,
          fast_moving,
          is_listed,
          products (
            product_id,
            sku_code,
            product_name,
            category,
            unit,
            image
          )
        `)
        .eq("vendor_id", VENDOR_ID)
        .order("avg_daily_sales", { ascending: false });

      if (!error && data) {
        setProducts(data.map(vp => ({
          id:           vp.vendor_product_id,
          productId:    vp.products.product_id,
          name:         vp.products.product_name,
          sku:          vp.products.sku_code,
          unit:         vp.products.unit,
          category:     vp.products.category,
          image:        vp.products.image,
          price:        vp.price,
          stock:        vp.physical_stock,
          safetyStock:  vp.safety_stock,
          reorderPt:    vp.reorder_point,
          avgDaily:     vp.avg_daily_sales,
          fastMoving:   vp.fast_moving,
          listed:       vp.is_listed,
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  return { products, setProducts, loading };
}

// ── Fetch active orders ───────────────────────────────────────────
export function useOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    // Realtime subscription
    const channel = supabase
      .channel("orders-channel")
      .on("postgres_changes", {
        event:  "*",
        schema: "public",
        table:  "orders",
        filter: `vendor_id=eq.${VENDOR_ID}`,
      }, () => loadOrders())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(product_id, quantity)`)
      .eq("vendor_id", VENDOR_ID)
      .not("order_status", "in", '("delivered","cancelled")')
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data.map(o => ({
        id:           o.order_id,
        status:       o.order_status,
        placedAt:     new Date(o.created_at),
        area:         o.customer_area,
        landmark:     o.landmark,
        payment:      o.payment_mode,
        checkedItems: {},
        items:        o.order_items.map(i => ({
          productId: i.product_id,
          qty:       i.quantity,
        })),
      })));
    }
    setLoading(false);
  }

  return { orders, setOrders, loading, reload: loadOrders };
}

// ── Place a new order ─────────────────────────────────────────────
export async function placeOrder({ items, total, address, landmark, payment, products }) {
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      vendor_id:    VENDOR_ID,
      customer_area: address,
      landmark,
      payment_mode: payment,
      order_status: "placed",
      total_amount: total,
    })
    .select()
    .single();

  if (error) throw error;

  const orderItems = items.map(item => ({
    order_id:   order.order_id,
    product_id: products.find(p => p.id === item.id)?.productId,
    quantity:   item.qty,
    unit_price: item.price,
  }));

  await supabase.from("order_items").insert(orderItems);
  return order;
}

// ── Update order status ───────────────────────────────────────────
export async function updateOrderStatus(orderId, status) {
  const patch = { order_status: status };
  if (status === "packed")    patch.packed_at    = new Date().toISOString();
  if (status === "delivered") patch.delivered_at = new Date().toISOString();

  const { error } = await supabase
    .from("orders")
    .update(patch)
    .eq("order_id", orderId);

  if (error) throw error;
}

// ── Deduct stock after packing ────────────────────────────────────
export async function deductStock(vendorProductId, qty) {
  const { data: vp } = await supabase
    .from("vendor_products")
    .select("physical_stock")
    .eq("vendor_product_id", vendorProductId)
    .single();

  const newStock = Math.max(0, (vp?.physical_stock || 0) - qty);

  await supabase
    .from("vendor_products")
    .update({
      physical_stock: newStock,
      listed_stock:   newStock,
      is_listed:      newStock > 0,
    })
    .eq("vendor_product_id", vendorProductId);
}

// ── Update stock manually ─────────────────────────────────────────
export async function addStock(vendorProductId, qty) {
  const { data: vp } = await supabase
    .from("vendor_products")
    .select("physical_stock")
    .eq("vendor_product_id", vendorProductId)
    .single();

  await supabase
    .from("vendor_products")
    .update({
      physical_stock: (vp?.physical_stock || 0) + qty,
      listed_stock:   (vp?.physical_stock || 0) + qty,
      is_listed:      true,
    })
    .eq("vendor_product_id", vendorProductId);
}

// ── Fetch completed orders for sales screen ───────────────────────
export function useCompletedOrders() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("orders")
        .select(`*, order_items(product_id, quantity)`)
        .eq("vendor_id", VENDOR_ID)
        .in("order_status", ["delivered", "refunded"])
        .gte("created_at", today)
        .order("created_at", { ascending: false });

      if (data) setCompleted(data.map(o => ({
        id:          o.order_id,
        status:      o.order_status,
        placedAt:    new Date(o.created_at),
        area:        o.customer_area,
        payment:     o.payment_mode,
        amount:      o.total_amount,
        refund:      null,
        items:       o.order_items.map(i => ({ productId: i.product_id, qty: i.quantity })),
      })));
    }
    load();
  }, []);

  return { completed };
}
