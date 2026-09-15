const STORAGE_KEY = 'votoConscienteContent';

export async function getContent() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Erro ao ler conteúdo:', err);
    return {};
  }
}

export async function saveContent(key, value) {
  try {
    const content = await getContent();
    content[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (err) {
    console.error('Erro ao salvar conteúdo:', err);
    return false;
  }
}

export async function resetContent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Erro ao resetar conteúdo:', err);
    return false;
  }
}

export function onContentChange(callback) {
  const handler = (e) => {
    if (e.key === STORAGE_KEY) {
      callback(e.newValue ? JSON.parse(e.newValue) : {});
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}