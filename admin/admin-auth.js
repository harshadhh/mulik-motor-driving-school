/* ============================================
   MULIK MOTOR — ADMIN AUTHENTICATION
   Simple, GitHub Pages safe client-side auth
   ============================================ */

// ⚠️ CHANGE THESE CREDENTIALS before going live
// These are stored here since GitHub Pages has no server.
// For extra security, keep /admin/ out of your public sitemap.
const ADMIN_CREDENTIALS = {
  username: 'mulikadmin',       // ← Change this
  password: 'mulik@motor2026'   // ← Change this to something strong
};

const SESSION_KEY = 'mulik_admin_session';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

function isLoggedIn() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return false;
  try {
    const data = JSON.parse(session);
    return Date.now() < data.expiry;
  } catch {
    return false;
  }
}

function createSession() {
  const data = { expiry: Date.now() + SESSION_DURATION };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function destroySession() {
  localStorage.removeItem(SESSION_KEY);
}

// === LOGIN PAGE LOGIC ===
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  // If already logged in, go to dashboard
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }

  const togglePass = document.getElementById('togglePass');
  const passInput  = document.getElementById('password');

  if (togglePass && passInput) {
    togglePass.addEventListener('click', () => {
      passInput.type = passInput.type === 'password' ? 'text' : 'password';
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl  = document.getElementById('loginError');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      createSession();
      window.location.href = 'dashboard.html';
    } else {
      errorEl.textContent = '❌ Incorrect username or password. Please try again.';
      errorEl.style.display = 'block';
      setTimeout(() => { errorEl.style.display = 'none'; }, 4000);
    }
  });
}

// === DASHBOARD PAGE — Guard ===
if (document.getElementById('logoutBtn')) {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    destroySession();
    window.location.href = 'index.html';
  });
}