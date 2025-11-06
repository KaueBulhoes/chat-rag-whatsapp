import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey
);

interface QueryOptions {
  filters?: Record<string, unknown>;
  limit?: number;
  order?: { column: string; ascending: boolean };
}

export async function selectFromTable<T>(
  table: string,
  options?: QueryOptions
) {
  try {
    let query = supabase.from(table).select("*");

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        query = query.eq(key, value);
      }
    }

    if (options?.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending,
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as T[];
  } catch (error) {
    console.error(`Error selecting from ${table}:`, error);
    throw error;
  }
}

export async function insertIntoTable<T>(table: string, data: T) {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
}

export async function updateTable<T>(
  table: string,
  data: Partial<T>,
  filters: Record<string, unknown>
) {
  try {
    let query = supabase.from(table).update(data);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { data: result, error } = await query.select();

    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }
}

export async function deleteFromTable(
  table: string,
  filters: Record<string, unknown>
) {
  try {
    let query = supabase.from(table).delete();

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

export default supabase;
