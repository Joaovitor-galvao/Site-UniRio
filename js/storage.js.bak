// Firebase Realtime Database - Sincronização cross-computer
// Dados salvos no Firebase são visíveis para todos os usuários logados em tempo real

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
  getDatabase, 
  ref as dbRef, 
  onValue, 
  set, 
  get, 
  child 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

// ✅ Configuração Firebase - gerada pelo GitHub Actions
// As variáveis são injetadas via js/firebase-config.js pelo deploy
const firebaseConfig = window.firebaseConfig;

// Inicializar Firebase apenas se config estiver disponível
let app = null;
let database = null;

try {
  if (window.firebaseConfig) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  }
} catch (e) {
  console.warn("Firebase initialization failed, falling back to localStorage", e);
}

/**
 * Obter conteúdo do Firebase Realtime Database
 * @returns {Promise<Object>} Conteúdo salvo no Firebase
 */
export async function getContentFromFirebase() {
  if (!database) {
    // Fallback para localStorage se Firebase não disponível
    const STORAGE_KEY = 'votoConscienteContent';
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
  
  try {
    const dbRef = child(dbRef(database), 'votoConscienteContent');
    return new Promise((resolve) => {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data || {});
      });
    });
  } catch (err) {
    console.error('Erro ao obter conteúdo do Firebase:', err);
    // Fallback para localStorage
    const STORAGE_KEY = 'votoConscienteContent';
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }
}

/**
 * Salvar conteúdo no Firebase Realtime Database
 * Isso sincroniza automaticamente para todos os usuários
 * @param {Object} content - Conteúdo a salvar {hero: "...", apresentacao: "...", ...}
 */
export async function saveContentToFirebase(content) {
  if (!database) {
    // Fallback para localStorage
    const STORAGE_KEY = 'votoConscienteContent';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return;
  }
  
  try {
    const dbRef = dbRef(database, 'votoConscienteContent');
    await set(dbRef, content);
  } catch (err) {
    console.error('Erro ao salvar no Firebase:', err);
    // Fallback para localStorage
    const STORAGE_KEY = 'votoConscienteContent';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }
}

/**
 * Observar mudanças no Firebase Realtime Database
 * Esta função registra um listener que é acionado sempre que o conteúdo
 * é alterado por QUALQUER admin em QUALQUER computador
 * @param {Function} callback - Função chamada com o novo conteúdo
 * @returns {Function} Função para remover o listener
 */
export function onContentChange(callback) {
  if (!database) {
    // Se Firebase não disponível, usar localStorage event (apenas mesma aba)
    const STORAGE_KEY = 'votoConscienteContent';
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        callback(e.newValue ? JSON.parse(e.newValue) : {});
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
  
  try {
    const dbRef = dbRef(database, 'votoConscienteContent');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      }
    });
    // Retornar função para remover o listener
    return () => {
      // O listener é removido automaticamente quando o componente desmonta
      // ou pode ser explicitamente removido desassinando o onValue
    };
  } catch (err) {
    console.error('Erro ao registrar listener Firebase:', err);
    // Fallback para localStorage
    const STORAGE_KEY = 'votoConscienteContent';
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        callback(e.newValue ? JSON.parse(e.newValue) : {});
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}

/**
 * Resetar conteúdo no Firebase e localStorage
 */
export async function resetContentFirebase() {
  if (!database) {
    localStorage.removeItem('votoConscienteContent');
    return;
  }
  
  try {
    const dbRef = dbRef(database, 'votoConscienteContent');
    await set(dbRef, {});
    // Also clear localStorage
    localStorage.removeItem('votoConscienteContent');
  } catch (err) {
    console.error('Erro ao resetar Firebase:', err);
    localStorage.removeItem('votoConscienteContent');
  }
}

// Exportar para compatibilidade com imports existentes
export default {
  getContentFromFirebase,
  saveContentToFirebase,
  onContentChange,
  resetContentFirebase
};