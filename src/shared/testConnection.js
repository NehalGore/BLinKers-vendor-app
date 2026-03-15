import { supabase } from "./supabase";

export async function testConnection() {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .limit(1);

  if (error) {
    console.error("❌ Supabase connection failed:", error.message);
    return false;
  }

  console.log("✅ Supabase connected! Vendor:", data[0]?.name);
  return true;
}
