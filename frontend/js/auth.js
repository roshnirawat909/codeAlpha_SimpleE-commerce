import { apiFetch, clearAuth, storeUser, getStoredUser, getAuthToken } from './api.js';

function setNavAuthState() {
  const token = getAuthToken();
  const user = getStoredUser();

  const authLink = document.getElementById('authLink');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!authLink || !logoutBtn) return;

  if (token && user) {
    authLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    logoutBtn.textContent = `Logout (${user.name || user.email})`;
  } else {
    authLink.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
}

export function wireLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;
  logoutBtn.addEventListener('click', () => {
    clearAuth();
    setNavAuthState();
    location.href = './index.html';
  });
}

export function wireAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email').value.trim();
      const password = loginForm.querySelector('#password').value;
      const toast = document.getElementById('authToast');
      toast.style.display = 'none';

      try {
        const data = await apiFetch('/api/users/login', {
          method: 'POST',
          body: { email, password }
        });
        localStorage.setItem('token', data.token);
        storeUser(data.user);
        setNavAuthState();
        location.href = './index.html';
      } catch (err) {
        toast.style.display = 'block';
        toast.className = 'toast err';
        toast.textContent = err.message;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = registerForm.querySelector('#email').value.trim();
      const password = registerForm.querySelector('#password').value;
      const name = (registerForm.querySelector('#name')?.value || '').trim();
      const toast = document.getElementById('authToast');
      toast.style.display = 'none';

      try {
        const data = await apiFetch('/api/users/register', {
          method: 'POST',
          body: { email, password, name }
        });
        localStorage.setItem('token', data.token);
        storeUser(data.user);
        setNavAuthState();
        location.href = './index.html';
      } catch (err) {
        toast.style.display = 'block';
        toast.className = 'toast err';
        toast.textContent = err.message;
      }
    });
  }
}

// Auto wire on any page that includes auth.js
(function init() {
  setNavAuthState();
  wireLogout();
  wireAuthForms();
})();

