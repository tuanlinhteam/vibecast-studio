/**
 * App UI & Auth Logic for VibeCast Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const topicInput = document.getElementById('topicInput');
  const btnGenerate = document.getElementById('btnGenerate');
  const presetsContainer = document.getElementById('presetsContainer');
  const speechOutput = document.getElementById('speechOutput');
  const scenesList = document.getElementById('scenesList');
  const toast = document.getElementById('toast');
  const btnCopySpeech = document.getElementById('btnCopySpeech');
  const btnExportTxt = document.getElementById('btnExportTxt');

  // Gemini API Key & Model Elements
  const geminiApiKeyInput = document.getElementById('geminiApiKey');
  const geminiModelSelect = document.getElementById('geminiModelSelect');
  const sceneCountSelect = document.getElementById('sceneCountSelect');
  const scenesHeaderTitle = document.getElementById('scenesHeaderTitle');
  const apiKeyBadge = document.getElementById('apiKeyBadge');
  const btnToggleKeyVis = document.getElementById('btnToggleKeyVis');
  const btnAiSuggest = document.getElementById('btnAiSuggest');

  // Auth Overlay Elements
  const authOverlay = document.getElementById('authOverlay');
  const userLoginBox = document.getElementById('userLoginBox');
  const adminLoginBox = document.getElementById('adminLoginBox');
  const adminDashboardBox = document.getElementById('adminDashboardBox');
  
  // Login Form Elements
  const formUserLogin = document.getElementById('formUserLogin');
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');
  const userLoginError = document.getElementById('userLoginError');
  const linkToAdminLogin = document.getElementById('linkToAdminLogin');

  // Register Form Elements
  const formUserRegister = document.getElementById('formUserRegister');
  const regUsername = document.getElementById('regUsername');
  const regPassword = document.getElementById('regPassword');
  const regConfirmPassword = document.getElementById('regConfirmPassword');
  const userRegError = document.getElementById('userRegError');
  const userRegSuccess = document.getElementById('userRegSuccess');
  const btnRegisterUserSubmit = document.getElementById('btnRegisterUserSubmit');
  const btnLoginUserSubmit = document.getElementById('btnLoginUserSubmit');
  const btnLoginAdminSubmit = document.getElementById('btnLoginAdminSubmit');

  // Admin Login Elements
  const formAdminLogin = document.getElementById('formAdminLogin');
  const adminPassword = document.getElementById('adminPassword');
  const adminLoginError = document.getElementById('adminLoginError');
  const linkToUserLogin = document.getElementById('linkToUserLogin');

  // Admin Dashboard Elements
  const btnEnterStudio = document.getElementById('btnEnterStudio');
  const btnLogoutAdmin = document.getElementById('btnLogoutAdmin');
  const formCreateUser = document.getElementById('formCreateUser');
  const newUsername = document.getElementById('newUsername');
  const newPassword = document.getElementById('newPassword');
  const newExpireDays = document.getElementById('newExpireDays');
  const newIsActive = document.getElementById('newIsActive');
  const createAccMsg = document.getElementById('createAccMsg');
  const userCountBadge = document.getElementById('userCountBadge');
  const btnRefreshUsers = document.getElementById('btnRefreshUsers');
  const userTableBody = document.getElementById('userTableBody');

  // Navbar Auth Session Info Elements
  const userSessionInfo = document.getElementById('userSessionInfo');
  const sessionUsername = document.getElementById('sessionUsername');
  const sessionStatusBadge = document.getElementById('sessionStatusBadge');
  const btnLogoutUser = document.getElementById('btnLogoutUser');
  const btnNavAdmin = document.getElementById('btnNavAdmin');

  let currentContext = 'coffee';
  let currentOutput = null;

  // --- 1. AUTHENTICATION & NAVIGATION SYSTEM ---

  function showAuthView(viewName) {
    authOverlay.style.display = 'flex';
    userLoginBox.style.display = 'none';
    adminLoginBox.style.display = 'none';
    adminDashboardBox.style.display = 'none';

    if (viewName === 'userLogin') {
      userLoginBox.style.display = 'flex';
      userLoginError.style.display = 'none';
    } else if (viewName === 'adminLogin') {
      adminLoginBox.style.display = 'flex';
      adminLoginError.style.display = 'none';
    } else if (viewName === 'adminDashboard') {
      adminDashboardBox.style.display = 'block';
      renderUserTable();
    }
  }

  function checkSessionState() {
    const pathname = window.location.pathname.toLowerCase();
    const session = AUTH_SERVICE.getSession();

    const userLoginSessionBar = document.getElementById('userLoginSessionBar');
    const userLoginSessionName = document.getElementById('userLoginSessionName');
    const adminLoginSessionBar = document.getElementById('adminLoginSessionBar');

    // Update active session bars on cards
    if (session) {
      if (session.role === 'user') {
        if (userLoginSessionBar) userLoginSessionBar.style.display = 'block';
        if (userLoginSessionName) userLoginSessionName.textContent = session.username;
        if (adminLoginSessionBar) adminLoginSessionBar.style.display = 'none';
      } else if (session.role === 'admin') {
        if (adminLoginSessionBar) adminLoginSessionBar.style.display = 'block';
        if (userLoginSessionBar) userLoginSessionBar.style.display = 'none';
      }
    } else {
      if (userLoginSessionBar) userLoginSessionBar.style.display = 'none';
      if (adminLoginSessionBar) adminLoginSessionBar.style.display = 'none';
    }

    // Support direct URL routes: /admin and /login
    if (pathname.includes('/admin')) {
      if (session && session.role === 'admin') {
        userSessionInfo.style.display = 'flex';
        sessionUsername.textContent = 'Admin';
        sessionStatusBadge.textContent = '🛡️ Ban Quản Trị';
        sessionStatusBadge.className = 'session-badge';
        showAuthView('adminDashboard');
      } else {
        userSessionInfo.style.display = 'none';
        showAuthView('adminLogin');
      }
      return;
    }

    if (!session) {
      userSessionInfo.style.display = 'none';
      showAuthView('userLogin');
      return;
    }

    if (session.role === 'admin') {
      userSessionInfo.style.display = 'flex';
      sessionUsername.textContent = 'Admin';
      sessionStatusBadge.textContent = '🛡️ Ban Quản Trị';
      sessionStatusBadge.className = 'session-badge';
      showAuthView('adminDashboard');
    } else if (session.role === 'user') {
      const accounts = AUTH_SERVICE.getAccounts();
      const user = accounts.find(a => a.username.toLowerCase() === session.username.toLowerCase());
      if (!user) {
        AUTH_SERVICE.logout();
        showAuthView('userLogin');
        return;
      }

      const status = AUTH_SERVICE.getAccountStatus(user);
      if (status.status !== 'active') {
        AUTH_SERVICE.logout();
        userLoginError.textContent = status.status === 'expired' ? 'Tài khoản của bạn đã hết hạn!' : 'Tài khoản đã bị tạm khóa!';
        userLoginError.style.display = 'block';
        showAuthView('userLogin');
        return;
      }

      userSessionInfo.style.display = 'flex';
      sessionUsername.textContent = user.username;
      sessionStatusBadge.textContent = status.label;
      sessionStatusBadge.className = 'session-badge';
      authOverlay.style.display = 'none';
    }
  }

  // Switch between Login views (if elements exist)
  if (linkToAdminLogin) {
    linkToAdminLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthView('adminLogin');
    });
  }

  if (linkToUserLogin) {
    linkToUserLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthView('userLogin');
    });
  }

  if (btnNavAdmin) {
    btnNavAdmin.addEventListener('click', () => {
      const session = AUTH_SERVICE.getSession();
      if (session && session.role === 'admin') {
        showAuthView('adminDashboard');
      } else {
        showAuthView('adminLogin');
      }
    });
  }

  // Auth Tab Switching (Login vs Register)
  function switchAuthTab(tabName) {
    const tabBtnLogin = document.getElementById('tabBtnLogin');
    const tabBtnRegister = document.getElementById('tabBtnRegister');
    const formUserLogin = document.getElementById('formUserLogin');
    const formUserRegister = document.getElementById('formUserRegister');
    const userLoginError = document.getElementById('userLoginError');
    const userRegError = document.getElementById('userRegError');
    const userRegSuccess = document.getElementById('userRegSuccess');

    if (tabName === 'login') {
      if (tabBtnLogin) tabBtnLogin.classList.add('active');
      if (tabBtnRegister) tabBtnRegister.classList.remove('active');
      if (formUserLogin) formUserLogin.style.display = 'block';
      if (formUserRegister) formUserRegister.style.display = 'none';
      if (userLoginError) userLoginError.style.display = 'none';
    } else if (tabName === 'register') {
      if (tabBtnRegister) tabBtnRegister.classList.add('active');
      if (tabBtnLogin) tabBtnLogin.classList.remove('active');
      if (formUserLogin) formUserLogin.style.display = 'none';
      if (formUserRegister) formUserRegister.style.display = 'block';
      if (userRegError) userRegError.style.display = 'none';
      if (userRegSuccess) userRegSuccess.style.display = 'none';
    }
  }

  // Global delegation for Tab click
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target) {
      if (target.id === 'tabBtnLogin' || target.closest('#tabBtnLogin')) {
        switchAuthTab('login');
      } else if (target.id === 'tabBtnRegister' || target.closest('#tabBtnRegister')) {
        switchAuthTab('register');
      }
    }
  });

  // User Register Form Handling
  function doRegister() {
    const u = regUsername ? regUsername.value.trim() : '';
    const p = regPassword ? regPassword.value.trim() : '';
    const cp = regConfirmPassword ? regConfirmPassword.value.trim() : '';

    if (userRegError) userRegError.style.display = 'none';
    if (userRegSuccess) userRegSuccess.style.display = 'none';

    if (!u) {
      if (userRegError) {
        userRegError.textContent = 'Vui lòng nhập tên tài khoản!';
        userRegError.style.display = 'block';
      }
      return;
    }
    if (!p) {
      if (userRegError) {
        userRegError.textContent = 'Vui lòng nhập mật khẩu!';
        userRegError.style.display = 'block';
      }
      return;
    }
    if (p !== cp) {
      if (userRegError) {
        userRegError.textContent = 'Mật khẩu xác nhận không khớp!';
        userRegError.style.display = 'block';
      }
      return;
    }

    const res = AUTH_SERVICE.registerUser(u, p);
    if (res.success) {
      if (userRegSuccess) userRegSuccess.style.display = 'block';
      if (regUsername) regUsername.value = '';
      if (regPassword) regPassword.value = '';
      if (regConfirmPassword) regConfirmPassword.value = '';
      showToast("🎉 Đăng ký thành công! Đang chờ Admin kích hoạt.");
    } else {
      if (userRegError) {
        userRegError.textContent = res.message;
        userRegError.style.display = 'block';
      }
    }
  }

  if (formUserRegister) {
    formUserRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      doRegister();
    });
  }

  if (btnRegisterUserSubmit) {
    btnRegisterUserSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      doRegister();
    });
  }

  // User Login Handling
  function doUserLogin() {
    const user = loginUsername ? loginUsername.value.trim() : '';
    const pass = loginPassword ? loginPassword.value.trim() : '';
    if (userLoginError) userLoginError.style.display = 'none';

    if (!user || !pass) {
      if (userLoginError) {
        userLoginError.textContent = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu!';
        userLoginError.style.display = 'block';
      }
      return;
    }

    const res = AUTH_SERVICE.loginUser(user, pass);
    if (res.success) {
      showToast(`✨ Đăng nhập thành công! Chào mừng ${res.user.username}`);
      authOverlay.style.display = 'none';
      checkSessionState();
      if (window.location.pathname.toLowerCase().includes('/login')) {
        window.location.href = '../';
      }
    } else {
      if (userLoginError) {
        userLoginError.textContent = res.message;
        userLoginError.style.display = 'block';
      }
    }
  }

  if (formUserLogin) {
    formUserLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      doUserLogin();
    });
  }

  if (btnLoginUserSubmit) {
    btnLoginUserSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      doUserLogin();
    });
  }

  // Admin Login Handling
  function doAdminLogin() {
    const pass = adminPassword ? adminPassword.value.trim() : '';
    if (adminLoginError) adminLoginError.style.display = 'none';

    if (!pass) {
      if (adminLoginError) {
        adminLoginError.textContent = 'Vui lòng nhập mật khẩu Admin!';
        adminLoginError.style.display = 'block';
      }
      return;
    }

    const res = AUTH_SERVICE.loginAdmin(pass);
    if (res.success) {
      showToast("🛡️ Đăng nhập quyền Admin thành công!");
      showAuthView('adminDashboard');
    } else {
      if (adminLoginError) {
        adminLoginError.textContent = res.message;
        adminLoginError.style.display = 'block';
      }
    }
  }

  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      doAdminLogin();
    });
  }

  if (btnLoginAdminSubmit) {
    btnLoginAdminSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      doAdminLogin();
    });
  }

  // Logout Buttons Handlers
  function handleLogout() {
    AUTH_SERVICE.logout();
    showToast("🚪 Đã đăng xuất thành công!");
    checkSessionState();
  }

  if (btnLogoutUser) btnLogoutUser.addEventListener('click', handleLogout);
  if (btnLogoutAdmin) btnLogoutAdmin.addEventListener('click', handleLogout);

  const btnLogoutUserCard = document.getElementById('btnLogoutUserCard');
  const btnLogoutAdminCard = document.getElementById('btnLogoutAdminCard');
  if (btnLogoutUserCard) btnLogoutUserCard.addEventListener('click', handleLogout);
  if (btnLogoutAdminCard) btnLogoutAdminCard.addEventListener('click', handleLogout);

  btnEnterStudio.addEventListener('click', () => {
    authOverlay.style.display = 'none';
  });

  // --- 2. ADMIN DASHBOARD MANAGEMENT ---
  let currentPage = 1;
  const PAGE_SIZE = 50;
  let searchQuery = '';

  const searchUserBox = document.getElementById('searchUserBox');
  if (searchUserBox) {
    searchUserBox.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      currentPage = 1;
      renderUserTable();
    });
  }

  // Preset Days Pills Click
  document.querySelectorAll('.btn-day-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-day-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      newExpireDays.value = btn.getAttribute('data-days');
    });
  });

  // Create User Submit
  formCreateUser.addEventListener('submit', () => {
    const u = newUsername.value.trim();
    const p = newPassword.value.trim();
    const d = newExpireDays.value;
    const active = newIsActive.checked;

    createAccMsg.style.display = 'none';

    const res = AUTH_SERVICE.createAccount(u, p, d, active);
    if (res.success) {
      createAccMsg.textContent = res.message;
      createAccMsg.className = 'auth-msg';
      createAccMsg.style.display = 'block';
      newUsername.value = '';
      newPassword.value = '';
      renderUserTable();
      setTimeout(() => { createAccMsg.style.display = 'none'; }, 3000);
    } else {
      createAccMsg.textContent = res.message;
      createAccMsg.className = 'auth-error';
      createAccMsg.style.display = 'block';
    }
  });

  btnRefreshUsers.addEventListener('click', () => {
    renderUserTable();
    showToast("🔄 Đã làm mới danh sách tài khoản!");
  });

  const btnActivatePendingUsers = document.getElementById('btnActivatePendingUsers');
  if (btnActivatePendingUsers) {
    btnActivatePendingUsers.addEventListener('click', () => {
      const accounts = AUTH_SERVICE.getAccounts();
      const pendingCount = accounts.filter(a => !a.isActive).length;

      if (pendingCount === 0) {
        showToast("ℹ️ Không có tài khoản nào đang chờ kích hoạt!");
        return;
      }

      if (confirm(`⚡ Bạn có chắc chắn muốn kích hoạt ${pendingCount} tài khoản ĐANG CHỜ với 7 ngày sử dụng không?`)) {
        const res = AUTH_SERVICE.activatePendingUsers(7);
        showToast(res.message);
        renderUserTable();
      }
    });
  }

  function renderUserTable() {
    const rawAccounts = AUTH_SERVICE.getAccounts();

    // 1. Sort accounts: Inactive / Pending (isActive === false) ALWAYS at the top!
    const accounts = [...rawAccounts].sort((a, b) => {
      if (!a.isActive && b.isActive) return -1;
      if (a.isActive && !b.isActive) return 1;

      const statusA = AUTH_SERVICE.getAccountStatus(a);
      const statusB = AUTH_SERVICE.getAccountStatus(b);
      if (statusA.status === 'expired' && statusB.status === 'active') return -1;
      if (statusA.status === 'active' && statusB.status === 'expired') return 1;

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    userCountBadge.textContent = `(${accounts.length})`;

    // 2. Filter by Quick Search
    const filteredAccounts = searchQuery 
      ? accounts.filter(a => a.username.toLowerCase().includes(searchQuery))
      : accounts;

    userTableBody.innerHTML = '';

    if (filteredAccounts.length === 0) {
      userTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:20px;">Không tìm thấy tài khoản người dùng nào.</td></tr>`;
      const paginationControls = document.getElementById('paginationControls');
      if (paginationControls) paginationControls.innerHTML = '';
      return;
    }

    // 3. Calculate Pagination (50 items per page)
    const totalPages = Math.ceil(filteredAccounts.length / PAGE_SIZE) || 1;
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, filteredAccounts.length);
    const pagedAccounts = filteredAccounts.slice(startIndex, endIndex);

    // 4. Render Table Rows for Current Page
    pagedAccounts.forEach(acc => {
      const statusInfo = AUTH_SERVICE.getAccountStatus(acc);
      const createdDate = new Date(acc.createdAt).toLocaleDateString('vi-VN');
      const expireDateStr = acc.expireAt ? new Date(acc.expireAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn';
      const lastLoginStr = acc.lastLoginAt 
        ? new Date(acc.lastLoginAt).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) 
        : '<span style="color:#64748b;">Chưa đăng nhập</span>';

      let statusBadgeHtml = `<span class="status-badge active">${statusInfo.label}</span>`;
      if (statusInfo.status === 'expired') {
        statusBadgeHtml = `<span class="status-badge expired">⚠️ Hết hạn (${expireDateStr})</span>`;
      } else if (statusInfo.status === 'disabled') {
        statusBadgeHtml = `<span class="status-badge disabled">🔴 Chờ kích hoạt</span>`;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(acc.username)}</strong></td>
        <td><code>${escapeHtml(acc.password)}</code></td>
        <td>${statusBadgeHtml}</td>
        <td>${expireDateStr}</td>
        <td>${lastLoginStr}</td>
        <td>${createdDate}</td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="btn-table-action btn-edit-user" data-user="${escapeHtml(acc.username)}" title="Chỉnh sửa tài khoản">✏️ Sửa</button>
            <button type="button" class="btn-table-action btn-toggle-user" data-user="${escapeHtml(acc.username)}" title="Khóa / Mở khóa">${acc.isActive ? '🔒 Khóa' : '🔓 Mở'}</button>
            <button type="button" class="btn-table-action danger btn-delete-user" data-user="${escapeHtml(acc.username)}" title="Xóa tài khoản">🗑️ Xóa</button>
          </div>
        </td>
      `;
      userTableBody.appendChild(tr);
    });

    // 5. Render Pagination Controls Bar
    const paginationControls = document.getElementById('paginationControls');
    if (paginationControls) {
      paginationControls.innerHTML = `
        <div style="font-size: 0.85rem; color: #94a3b8;">
          Hiển thị <strong>${startIndex + 1} - ${endIndex}</strong> trong tổng số <strong>${filteredAccounts.length}</strong> tài khoản
        </div>
        <div class="pagination-buttons" style="display: flex; gap: 8px; align-items: center;">
          <button type="button" class="btn btn-secondary btn-sm" id="btnPrevPage" ${currentPage <= 1 ? 'disabled' : ''}>◄ Trang trước</button>
          <span style="font-size: 0.85rem; color: #cbd5e1; padding: 0 4px;">Trang <strong>${currentPage}</strong> / ${totalPages}</span>
          <button type="button" class="btn btn-secondary btn-sm" id="btnNextPage" ${currentPage >= totalPages ? 'disabled' : ''}>Trang sau ►</button>
        </div>
      `;

      const btnPrevPage = document.getElementById('btnPrevPage');
      const btnNextPage = document.getElementById('btnNextPage');

      if (btnPrevPage) {
        btnPrevPage.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            renderUserTable();
          }
        });
      }

      if (btnNextPage) {
        btnNextPage.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderUserTable();
          }
        });
      }
    }

    // Action button listeners
    document.querySelectorAll('.btn-edit-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const u = e.target.getAttribute('data-user');
        openEditModal(u);
      });
    });

    document.querySelectorAll('.btn-toggle-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const u = e.target.getAttribute('data-user');
        const res = AUTH_SERVICE.toggleAccountStatus(u);
        showToast(`Đã ${res.isActive ? 'Mở khóa' : 'Khóa'} tài khoản "${u}"`);
        renderUserTable();
      });
    });

    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const u = e.target.getAttribute('data-user');
        if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${u}" không?`)) {
          AUTH_SERVICE.deleteAccount(u);
          showToast(`🗑️ Đã xóa tài khoản "${u}"`);
          renderUserTable();
        }
      });
    });
  }

  // Edit User Modal Handlers
  const editUserModal = document.getElementById('editUserModal');
  const editUsername = document.getElementById('editUsername');
  const editPassword = document.getElementById('editPassword');
  const editRemainingDays = document.getElementById('editRemainingDays');
  const editIsActive = document.getElementById('editIsActive');
  const btnCloseEditModal = document.getElementById('btnCloseEditModal');
  const btnCancelEdit = document.getElementById('btnCancelEdit');
  const btnToggleEditPassVis = document.getElementById('btnToggleEditPassVis');
  const formEditUser = document.getElementById('formEditUser');

  function openEditModal(username) {
    const accounts = AUTH_SERVICE.getAccounts();
    const acc = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());
    if (!acc) return;

    const statusInfo = AUTH_SERVICE.getAccountStatus(acc);
    const remainingDays = (statusInfo.daysLeft !== undefined && statusInfo.daysLeft !== 99999) ? statusInfo.daysLeft : 7;

    if (editUsername) editUsername.value = acc.username;
    if (editPassword) editPassword.value = acc.password;
    if (editRemainingDays) editRemainingDays.value = remainingDays > 0 ? remainingDays : 7;
    if (editIsActive) editIsActive.checked = Boolean(acc.isActive);
    if (editUserModal) editUserModal.style.display = 'flex';
  }

  function closeEditModal() {
    if (editUserModal) editUserModal.style.display = 'none';
  }

  if (btnCloseEditModal) btnCloseEditModal.addEventListener('click', closeEditModal);
  if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEditModal);

  if (btnToggleEditPassVis && editPassword) {
    btnToggleEditPassVis.addEventListener('click', () => {
      if (editPassword.type === 'password') {
        editPassword.type = 'text';
        btnToggleEditPassVis.textContent = '🙈';
      } else {
        editPassword.type = 'password';
        btnToggleEditPassVis.textContent = '👁️';
      }
    });
  }

  if (formEditUser) {
    formEditUser.addEventListener('submit', () => {
      const u = editUsername ? editUsername.value : '';
      const p = editPassword ? editPassword.value : '';
      const days = editRemainingDays ? editRemainingDays.value : 7;
      const active = editIsActive ? editIsActive.checked : true;

      const res = AUTH_SERVICE.updateAccount(u, p, days, active);
      if (res.success) {
        showToast(`✨ Đã cập nhật tài khoản "${u}" thành công!`);
        closeEditModal();
        renderUserTable();
      } else {
        alert(res.message);
      }
    });
  }

  // --- 3. LOCALSTORAGE API KEY & MODEL PERSISTENCE ---
  const STORAGE_KEY = 'oneshort_gemini_api_key';
  const STORAGE_MODEL = 'oneshort_gemini_model';

  const savedKey = localStorage.getItem(STORAGE_KEY);
  const savedModel = localStorage.getItem(STORAGE_MODEL);

  if (savedKey) {
    geminiApiKeyInput.value = savedKey;
    updateKeyBadgeStatus(true);
  } else {
    updateKeyBadgeStatus(false);
  }

  if (savedModel && (savedModel === 'gemini-3.6-flash' || savedModel === 'gemini-3.7-flash')) {
    geminiModelSelect.value = savedModel;
  } else {
    geminiModelSelect.value = 'gemini-3.6-flash';
    localStorage.setItem(STORAGE_MODEL, 'gemini-3.6-flash');
  }

  geminiApiKeyInput.addEventListener('input', () => {
    const val = geminiApiKeyInput.value.trim();
    if (val) {
      localStorage.setItem(STORAGE_KEY, val);
      updateKeyBadgeStatus(true);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      updateKeyBadgeStatus(false);
    }
  });

  geminiModelSelect.addEventListener('change', () => {
    localStorage.setItem(STORAGE_MODEL, geminiModelSelect.value);
    showToast(`🤖 Đã chọn Model: ${geminiModelSelect.options[geminiModelSelect.selectedIndex].text}`);
  });

  btnToggleKeyVis.addEventListener('click', () => {
    if (geminiApiKeyInput.type === 'password') {
      geminiApiKeyInput.type = 'text';
      btnToggleKeyVis.textContent = '🔒';
    } else {
      geminiApiKeyInput.type = 'password';
      btnToggleKeyVis.textContent = '👁️';
    }
  });

  function updateKeyBadgeStatus(isSaved) {
    if (isSaved) {
      apiKeyBadge.textContent = '🟢 Đã lưu Key';
      apiKeyBadge.className = 'key-status configured';
    } else {
      apiKeyBadge.textContent = '🔴 Chưa lưu Key';
      apiKeyBadge.className = 'key-status unconfigured';
    }
  }

  // --- 4. GEMINI AI TOPIC SUGGESTION ---
  btnAiSuggest.addEventListener('click', async () => {
    const apiKey = geminiApiKeyInput.value.trim();
    const model = geminiModelSelect.value;

    if (!apiKey) {
      showToast("⚠️ Vui lòng nhập Gemini API Key để dùng AI gợi ý!");
      geminiApiKeyInput.focus();
      return;
    }

    btnAiSuggest.classList.add('loading');
    btnAiSuggest.textContent = '⏳ Gemini đang nghĩ...';

    try {
      const topics = await GEMINI_SERVICE.generateTopics(apiKey, model);
      renderAiTopics(topics);
      showToast(`✨ Gemini (${model}) đã gợi ý 5 chủ đề mới!`);
    } catch (err) {
      alert(err.message || "Không thể lấy gợi ý từ Gemini. Vui lòng kiểm tra lại API Key!");
    } finally {
      btnAiSuggest.classList.remove('loading');
      btnAiSuggest.textContent = '✨ Gợi Ý Chủ Đề Bằng AI (Gemini)';
    }
  });

  function renderAiTopics(topicsList) {
    presetsContainer.innerHTML = '';
    topicsList.forEach((topicText) => {
      const btn = document.createElement('button');
      btn.className = 'preset-pill';
      btn.setAttribute('data-topic', topicText);
      btn.textContent = `💡 ${topicText}`;
      presetsContainer.appendChild(btn);
    });
  }

  // --- 5. PRESETS ---
  presetsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('preset-pill')) {
      const selectedTopic = e.target.getAttribute('data-topic') || e.target.textContent.replace('💡 ', '');
      topicInput.value = selectedTopic;
      showToast(`💡 Đã chọn chủ đề! Bấm nút "⚡ Phân Tích & Tạo Kịch Bản Viral" để tạo.`);
    }
  });

  // --- 6. SCRIPT GENERATION & RENDER ---
  btnGenerate.addEventListener('click', () => {
    runGeneration();
  });

  async function runGeneration() {
    const topic = topicInput.value.trim();
    if (!topic) {
      showToast("⚠️ Vui lòng nhập hoặc chọn Chủ Đề Trình Bày trước khi bấm tạo!");
      return;
    }

    const sceneCount = sceneCountSelect ? (parseInt(sceneCountSelect.value) || 6) : 6;

    btnGenerate.disabled = true;
    btnGenerate.textContent = "⏳ Đang phân tích & tạo kịch bản Viral...";
    showToast(`⏳ Đang phân tích chủ đề & sáng tạo kịch bản Viral (${sceneCount} phân cảnh)...`);

    const apiKey = geminiApiKeyInput.value.trim();
    const model = geminiModelSelect.value;

    let aiScenes = null;
    if (apiKey) {
      try {
        aiScenes = await GEMINI_SERVICE.generateExpertScript(apiKey, model, topic, sceneCount);
      } catch (e) {
        console.warn("Gemini AI Script generation failed, falling back to local engine:", e);
      }
    }

    if (aiScenes && Array.isArray(aiScenes) && aiScenes.length >= 3) {
      const fullText = aiScenes.map(s => s.dialogue).join(" ");
      const refImgPrompt = GENERATOR_ENGINE.buildRefImagePrompt();
      currentOutput = {
        topic: topic,
        voiceSpec: "Giọng Nam chuyên gia (25-28 tuổi), phát âm chuẩn, trầm ấm, rõ chữ, phong thái tự tin và truyền cảm hứng",
        fullSpeech: fullText,
        totalDuration: `${Math.round(aiScenes.length * 7.5)} giây (${aiScenes.length} cảnh × 7.5 giây)`,
        refImagePrompt: refImgPrompt,
        scenes: aiScenes
      };
      showToast(`✨ Gemini AI đã sáng tạo kịch bản Content Win (${aiScenes.length} cảnh) độc bản thành công!`);
    } else {
      // Local fallback engine guaranteed to work 100%
      currentOutput = GENERATOR_ENGINE.generate(topic, sceneCount);
      showToast(apiKey ? `⚡ Đã tự động tạo kịch bản Viral ${currentOutput.scenes.length} cảnh cho chủ đề!` : `✨ Đã sáng tạo kịch bản Viral ${currentOutput.scenes.length} cảnh thành công!`);
    }

    btnGenerate.disabled = false;
    btnGenerate.textContent = "⚡ Phân Tích & Tạo Kịch Bản Viral";

    renderResults(currentOutput);
  }

  const refPromptOutput = document.getElementById('refPromptOutput');
  const btnCopyRefPrompt = document.getElementById('btnCopyRefPrompt');

  function renderResults(data) {
    speechOutput.textContent = data.fullSpeech;
    if (refPromptOutput && data.refImagePrompt) {
      refPromptOutput.textContent = data.refImagePrompt;
    }

    if (scenesHeaderTitle) {
      scenesHeaderTitle.textContent = `🎬 PHÂN CẢNH ${data.scenes.length} CLIP VEO 3 (KHÓA NHÂN VẬT & MẶT MẪU)`;
    }

    if (btnCopyAllPrompts) {
      btnCopyAllPrompts.textContent = `📋 Copy Tất Cả ${data.scenes.length} Prompt (Cách 1 Dòng)`;
    }

    scenesList.innerHTML = '';

    data.scenes.forEach(scene => {
      const card = document.createElement('div');
      card.className = 'scene-card';
      card.innerHTML = `
        <div class="scene-meta">
          <div class="scene-title">
            <span class="scene-number">CẢNH ${scene.sceneNum}</span>
            <span class="scene-goal">${scene.goal}</span>
          </div>
          <span class="scene-duration">7.5 giây</span>
        </div>

        <div class="scene-body">
          <div class="detail-block">
            <h5>🗣️ Lời thoại & Khẩu hình</h5>
            <p>"${scene.dialogue}"</p>
          </div>
          <div class="detail-block">
            <h5>😊 Biểu cảm & Tư thế</h5>
            <p><strong>Thần thái:</strong> ${scene.expression}</p>
            <p><strong>Đầu:</strong> ${scene.startPose} ➔ <strong>Cuối:</strong> ${scene.endPose}</p>
          </div>
        </div>

        <div class="prompt-box">
          <h5>
            <span>🎥 PROMPT VEO 3 (VIDEO SẠCH 9:16)</span>
            <button class="btn btn-secondary btn-sm btn-copy-prompt" data-prompt="${escapeHtml(scene.veoPrompt)}">
              📋 Copy Prompt Cảnh ${scene.sceneNum}
            </button>
          </h5>
          <div class="prompt-content">${escapeHtml(scene.veoPrompt)}</div>
        </div>
      `;

      scenesList.appendChild(card);
    });

    document.querySelectorAll('.btn-copy-prompt').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const textToCopy = e.target.getAttribute('data-prompt');
        copyToClipboard(textToCopy);
        showToast("📋 Đã copy Prompt Cảnh vào Clipboard!");
      });
    });
  }

  if (btnCopyRefPrompt) {
    btnCopyRefPrompt.addEventListener('click', () => {
      if (currentOutput && currentOutput.refImagePrompt) {
        copyToClipboard(currentOutput.refImagePrompt);
        showToast("🖼️ Đã copy Prompt Tạo Ảnh Tham Chiếu (9:16)!");
      }
    });
  }

  const btnCopyAllPrompts = document.getElementById('btnCopyAllPrompts');
  if (btnCopyAllPrompts) {
    btnCopyAllPrompts.addEventListener('click', () => {
      if (currentOutput && currentOutput.scenes) {
        const allPromptsText = currentOutput.scenes.map(s => s.veoPrompt).join('\n\n');
        copyToClipboard(allPromptsText);
        showToast(`📋 Đã copy toàn bộ ${currentOutput.scenes.length} Prompt Veo 3 (mỗi prompt cách 1 dòng)!`);
      }
    });
  }

  btnCopySpeech.addEventListener('click', () => {
    if (currentOutput) {
      copyToClipboard(currentOutput.fullSpeech);
      showToast("🗣️ Đã copy Lời thoại One-shot!");
    }
  });

  btnExportTxt.addEventListener('click', () => {
    if (!currentOutput) return;
    let content = `=========================================\n`;
    content += `KỊCH BẢN ONE-SHOT 9:16 (${currentOutput.scenes.length} CẢNH - VIBECAST STUDIO)\n`;
    content += `Chủ đề: ${currentOutput.topic}\n`;
    content += `Giọng đọc: ${currentOutput.voiceSpec}\n`;
    content += `Thời lượng: ${currentOutput.totalDuration}\n`;
    content += `=========================================\n\n`;
    content += `LỜI THOẠI HOÀN CHỈNH:\n${currentOutput.fullSpeech}\n\n`;
    content += `=========================================\n`;
    content += `PROMPT TẠO ẢNH THAM CHIẾU MẪU (9:16):\n${currentOutput.refImagePrompt || ''}\n\n`;
    content += `=========================================\n`;
    content += `BẢNG ${currentOutput.scenes.length} PROMPT VEO 3:\n\n`;

    currentOutput.scenes.forEach(s => {
      content += `--- CẢNH ${s.sceneNum}: ${s.goal} ---\n`;
      content += `Thoại: ${s.dialogue}\n`;
      content += `Prompt Veo 3:\n${s.veoPrompt}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kich_Ban_VibeCast_${currentOutput.scenes.length}Canh_${Date.now()}.txt`;
    a.click();
    showToast("💾 Đã tải file Kịch bản .txt!");
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Register Firebase Realtime sync listener to update UI instantly
  AUTH_SERVICE.onUsersChanged = function(accounts) {
    if (adminDashboardBox && adminDashboardBox.style.display !== 'none') {
      renderUserTable();
    }
  };

  // Check auth session on startup
  checkSessionState();
});
