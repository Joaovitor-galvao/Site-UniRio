// ============================================
// STORAGE - Sincronização de conteúdo
// localStorage + Firebase (opcional)
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
  getDatabase, ref, onValue, set, get, child
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const STORAGE_KEY = 'votoConscienteContent';

let database = null;

try {
  if (typeof window !== 'undefined' && window.firebaseConfig) {
    const app = initializeApp(window.firebaseConfig);
    database = getDatabase(app);
    console.log('🔥 Firebase conectado');
  } else {
    console.log('📦 Firebase não configurado — usando localStorage');
  }
} catch (e) {
  console.warn('⚠️ Firebase falhou, usando localStorage:', e);
  database = null;
}

// ============================================
// API PÚBLICA
// ============================================

export async function getContent() {
  if (database) {
    try {
      const dbPath = child(ref(database), 'votoConscienteContent');
      const snapshot = await get(dbPath);
      const data = snapshot.val();
      if (data) return data;
    } catch (err) {
      console.error('Erro Firebase (leitura):', err);
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export async function saveContent(key, value) {
  const current = await getContent();
  current[key] = value;
  await saveAllContent(current);
  return current;
}

export async function saveAllContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch (e) { console.error('Erro localStorage:', e); }

  if (database) {
    try {
      const dbPath = child(ref(database), 'votoConscienteContent');
      await set(dbPath, content);
      console.log('🔥 Sincronizado com Firebase');
    } catch (err) { console.error('Erro Firebase (escrita):', err); }
  }
}

export async function getSavedContent() {
  return await getContent();
}

export async function resetContent() {
  localStorage.removeItem(STORAGE_KEY);
  if (database) {
    try {
      const dbPath = child(ref(database), 'votoConscienteContent');
      await set(dbPath, {});
    } catch (err) { console.error('Erro Firebase (reset):', err); }
  }
}

export function onContentChange(callback) {
  getContent().then(callback).catch(() => callback({}));

  if (database) {
    const dbPath = child(ref(database), 'votoConscienteContent');
    return onValue(dbPath, (snapshot) => {
      const data = snapshot.val();
      if (data) callback(data);
    });
  }

  const handler = (e) => {
    if (e.key === STORAGE_KEY) {
      callback(e.newValue ? JSON.parse(e.newValue) : {});
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export default {
  getContent, saveContent, saveAllContent,
  getSavedContent, resetContent, onContentChange
};
