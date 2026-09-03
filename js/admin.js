console.log('🚀 Admin.js carregado!');
let isAuthenticated = false;
document.addEventListener('DOMContentLoaded', function() {
    const session = localStorage.getItem('votoConscienteSession');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (data.username === 'admin' && data.expires && data.expires > Date.now()) {
                isAuthenticated = true;
            }
        } catch(e) {}
    }
    if (document.getElementById('admin-toggle')) return;
    const adminBtn = document.createElement('div');
    adminBtn.id = 'admin-toggle';
    adminBtn.className = 'admin-float-btn';
    adminBtn.innerHTML = isAuthenticated ? '👑' : '🔐';
    adminBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px;
        border-radius: 50%; background: ${isAuthenticated ? '#27ae60' : '#612a2a'};
        color: #faf5e8; border: none; font-size: 28px; cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 9999;
        transition: all 0.3s ease; display: flex; align-items: center; justify-content: center;
    `;
    adminBtn.addEventListener('click', function() {
        if (isAuthenticated) {
            window.location.href = 'admin/index.html';
        } else {
            window.location.href = 'admin/login.html';
        }
    });
    document.body.appendChild(adminBtn);
    console.log('🔘 Botão admin adicionado');
});
