import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  console.log("Fetching orders...");
  const { data, error } = await supabase.from('orders').select('*');
  console.log("Data:", data);
  if (error) console.log("Error:", error);
}

test();
