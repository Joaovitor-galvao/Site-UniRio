import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, get, set, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

signInAnonymously(auth).catch((err) => {
  console.error('Firebase auth anônimo falhou:', err);
});

const CONTENT_PATH = 'votoConscienteContent';

export async function getContent() {
  try {
    const snap = await get(ref(db, CONTENT_PATH));
    return snap.val() || {};
  } catch (err) {
    console.error('Erro ao ler conteúdo:', err);
    return {};
  }
}

export async function saveContent(key, value) {
  try {
    const content = await getContent();
    content[key] = value;
    await set(ref(db, CONTENT_PATH), content);
    return true;
  } catch (err) {
    console.error('Erro ao salvar conteúdo:', err);
    return false;
  }
}

export async function resetContent() {
  try {
    await remove(ref(db, CONTENT_PATH));
    return true;
  } catch (err) {
    console.error('Erro ao resetar conteúdo:', err);
    return false;
  }
}

export function onContentChange(callback) {
  const contentRef = ref(db, CONTENT_PATH);
  const unsubscribe = onValue(contentRef, (snap) => {
    callback(snap.val() || {});
  }, (err) => {
    console.error('Erro no listener real-time:', err);
  });
  return unsubscribe;
}