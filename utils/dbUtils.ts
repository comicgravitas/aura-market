
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Item } from '../types';

// Hardcoded Supabase Credentials
const SUPABASE_URL = 'https://vnnsbqrhkvqkjebdgkvf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubnNicXJoa3Zxa2plYmRna3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTQzMTgsImV4cCI6MjA4NTk3MDMxOH0.8PamO6DIUaZE2sVee8aCJ-oR9QrpmxK90SVZo8bft9Y';

const DB_NAME = 'ai_marketplace_local';
const DB_VERSION = 1;
const STORE_NAME = 'items';

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject('Error opening local database');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getAllItems = async (): Promise<Item[]> => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Supabase Fetch Error: ${error.message}`);
    
    // Map database imageurl (lowercase) to TypeScript imageUrl (camelCase)
    const mappedData = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
      imageUrl: row.imageurl || row.imageUrl // Handle both just in case
    }));
    
    return mappedData as Item[];
  } catch (err: any) {
    console.warn("Cloud fetch failed, using local fallback", err);
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Error fetching local items');
    });
  }
};

export const saveItem = async (item: Item): Promise<void> => {
  try {
    const { error } = await supabase.from('items').upsert({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      imageurl: item.imageUrl 
    }, { onConflict: 'id' });
    
    if (error) {
      console.error("Supabase UPSERT Error Response:", error);
      throw new Error(`Database Sync Failed: ${error.message} (Code: ${error.code})`);
    }
  } catch (err: any) {
    console.error("Supabase Save Exception:", err);
    throw err;
  }

  // Local sync
  try {
    const db = await initIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Local cache update failed');
    });
  } catch (localErr) {
    console.warn("Local sync skipped", localErr);
  }
};

export const deleteItemFromDB = async (id: string): Promise<void> => {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw new Error(`Delete failed: ${error.message}`);

  try {
    const db = await initIndexedDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
  } catch (e) {
    console.warn("Local delete skipped");
  }
};
