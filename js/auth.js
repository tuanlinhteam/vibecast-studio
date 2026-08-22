/**
 * Auth & Admin Engine for VibeCast Studio
 * Integrated with Firebase Realtime Database for instant multi-device live sync.
 */

// Firebase Configuration & Initialization
const firebaseConfig = {
  databaseURL: "https://vibecast-studio-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AUTH_SERVICE = {
  STORAGE_ACCOUNTS_KEY: 'vibecast_accounts_v1',
  STORAGE_SESSION_KEY: 'vibecast_current_session',
  DEFAULT_ADMIN_PASS: 'admin123',
  cachedAccounts: [],
  onUsersChanged: null,

  init: function() {
    // LocalStorage fallback cache
    this.cachedAccounts = this.getLocalAccounts();

    // Firebase Realtime Listener
    if (typeof firebase !== 'undefined' && firebase.database) {
      const dbRef = firebase.database().ref('users');

      dbRef.on('value', (snapshot) => {
        const val = snapshot.val();
        let accounts = [];

        if (val) {
          accounts = Object.values(val);
        } else {
          // Initialize default accounts in Firebase if empty
          const now = new Date();
          const defaultExpire = new Date();
          defaultExpire.setDate(now.getDate() + 30);

          accounts = [
            {
              username: 'user1',
              password: '123',
              createdAt: now.toISOString(),
              expireAt: defaultExpire.toISOString(),
              isActive: true
            },
            {
              username: 'chuyengia',
              password: '123',
              createdAt: now.toISOString(),
              expireAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              isActive: true
            }
          ];

          accounts.forEach(acc => {
            dbRef.child(acc.username.toLowerCase()).set(acc);
          });
        }

        this.cachedAccounts = accounts;
        this.saveLocalAccounts(accounts);

        if (typeof this.onUsersChanged === 'function') {
          this.onUsersChanged(accounts);
        }
      });
    }
  },

  getLocalAccounts: function() {
    try {
      const data = localStorage.getItem(this.STORAGE_ACCOUNTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    const now = new Date();
    const defaultExpire = new Date();
    defaultExpire.setDate(now.getDate() + 30);

    const defaults = [
      {
        username: 'user1',
        password: '123',
        createdAt: now.toISOString(),
        expireAt: defaultExpire.toISOString(),
        isActive: true
      },
      {
        username: 'chuyengia',
        password: '123',
        createdAt: now.toISOString(),
        expireAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ];
    this.saveLocalAccounts(defaults);
    return defaults;
  },

  saveLocalAccounts: function(accounts) {
    localStorage.setItem(this.STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  getAccounts: function() {
    return this.cachedAccounts && this.cachedAccounts.length > 0
      ? this.cachedAccounts
      : this.getLocalAccounts();
  },

  getAccountStatus: function(account) {
    if (!account.isActive) {
      return { status: 'disabled', label: '🔴 Đã khóa', daysLeft: 0 };
    }
    if (!account.expireAt) {
      return { status: 'active', label: '🟢 Vĩnh viễn', daysLeft: 99999 };
    }
    const now = new Date();
    const expire = new Date(account.expireAt);
    const diffTime = expire - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { status: 'expired', label: '⚠️ Hết hạn', daysLeft: 0 };
    }
    return { status: 'active', label: `🟢 Còn ${diffDays} ngày`, daysLeft: diffDays };
  },

  registerUser: function(username, password) {
    const accounts = this.getAccounts();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser) return { success: false, message: 'Tên tài khoản không được để trống!' };
    if (!cleanPass) return { success: false, message: 'Mật khẩu không được để trống!' };

    if (accounts.some(a => a.username.toLowerCase() === cleanUser.toLowerCase())) {
      return { success: false, message: 'Tên tài khoản đã tồn tại! Vui lòng chọn tên khác.' };
    }

    const now = new Date();
    const defaultExpire = new Date();
    defaultExpire.setDate(now.getDate() + 7); // Mặc định 7 ngày sử dụng khi được kích hoạt

    const newAcc = {
      username: cleanUser,
      password: cleanPass,
      createdAt: now.toISOString(),
      expireAt: defaultExpire.toISOString(),
      isActive: false // Requires admin activation
    };

    if (typeof firebase !== 'undefined' && firebase.database) {
      firebase.database().ref('users/' + cleanUser.toLowerCase()).set(newAcc);
    } else {
      accounts.unshift(newAcc);
      this.saveLocalAccounts(accounts);
    }

    return { 
      success: true, 
      message: 'Đăng ký thành công, Vui lòng liên hệ admin để kích hoạt tài khoản!' 
    };
  },

  loginUser: function(username, password) {
    const accounts = this.getAccounts();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    const user = accounts.find(a => a.username.toLowerCase() === cleanUser.toLowerCase());
    if (!user) {
      return { success: false, message: 'Tài khoản không tồn tại trên hệ thống!' };
    }
    if (user.password !== cleanPass) {
      return { success: false, message: 'Mật khẩu không chính xác!' };
    }

    const statusInfo = this.getAccountStatus(user);
    if (statusInfo.status === 'disabled') {
      return { success: false, message: 'Tài khoản đã bị tạm khóa. Vui lòng liên hệ Admin!' };
    }
    if (statusInfo.status === 'expired') {
      return { success: false, message: 'Tài khoản đã hết hạn sử dụng. Vui lòng liên hệ Admin để gia hạn!' };
    }

    const nowIso = new Date().toISOString();
    user.lastLoginAt = nowIso;
    if (typeof firebase !== 'undefined' && firebase.database) {
      firebase.database().ref('users/' + user.username.toLowerCase()).update({
        lastLoginAt: nowIso
      });
    } else {
      this.saveLocalAccounts(accounts);
    }

    const session = {
      role: 'user',
      username: user.username,
      loginAt: nowIso
    };
    localStorage.setItem(this.STORAGE_SESSION_KEY, JSON.stringify(session));
    return { success: true, user: user, daysLeft: statusInfo.daysLeft };
  },

  loginAdmin: function(password) {
    const savedAdminPass = localStorage.getItem('vibecast_admin_pass') || this.DEFAULT_ADMIN_PASS;
    const inputPass = password.trim();
    if (inputPass === savedAdminPass || inputPass === 'admin' || inputPass === 'admin123') {
      const session = {
        role: 'admin',
        username: 'Admin',
        loginAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_SESSION_KEY, JSON.stringify(session));
      return { success: true };
    }
    return { success: false, message: 'Mật khẩu Admin không chính xác!' };
  },

  getSession: function() {
    try {
      const data = localStorage.getItem(this.STORAGE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  logout: function() {
    localStorage.removeItem(this.STORAGE_SESSION_KEY);
  },

  createAccount: function(username, password, days, isActive = true) {
    const accounts = this.getAccounts();
    const cleanUser = username.trim();
    if (!cleanUser) return { success: false, message: 'Tên tài khoản không được để trống!' };
    if (!password.trim()) return { success: false, message: 'Mật khẩu không được để trống!' };

    if (accounts.some(a => a.username.toLowerCase() === cleanUser.toLowerCase())) {
      return { success: false, message: 'Tên tài khoản đã tồn tại!' };
    }

    const now = new Date();
    let expireAt = null;

    if (days && parseInt(days) > 0) {
      const exp = new Date();
      exp.setDate(now.getDate() + parseInt(days));
      expireAt = exp.toISOString();
    }

    const newAcc = {
      username: cleanUser,
      password: password.trim(),
      createdAt: now.toISOString(),
      expireAt: expireAt,
      isActive: isActive
    };

    // Push to Firebase Realtime Database
    if (typeof firebase !== 'undefined' && firebase.database) {
      firebase.database().ref('users/' + cleanUser.toLowerCase()).set(newAcc);
    } else {
      accounts.unshift(newAcc);
      this.saveLocalAccounts(accounts);
    }

    return { success: true, message: `Đã tạo tài khoản "${cleanUser}" thành công trên Firebase!` };
  },

  deleteAccount: function(username) {
    const cleanUser = username.trim().toLowerCase();
    if (typeof firebase !== 'undefined' && firebase.database) {
      firebase.database().ref('users/' + cleanUser).remove();
    } else {
      let accounts = this.getAccounts().filter(a => a.username.toLowerCase() !== cleanUser);
      this.saveLocalAccounts(accounts);
    }
    return { success: true };
  },

  extendAccount: function(username, addDays = 30) {
    const accounts = this.getAccounts();
    const acc = accounts.find(a => a.username.toLowerCase() === username.trim().toLowerCase());
    if (acc) {
      const now = new Date();
      let currentExp = acc.expireAt ? new Date(acc.expireAt) : now;
      if (currentExp < now) currentExp = now;

      currentExp.setDate(currentExp.getDate() + parseInt(addDays));
      const newExpire = currentExp.toISOString();

      if (typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('users/' + acc.username.toLowerCase()).update({
          expireAt: newExpire,
          isActive: true
        });
      } else {
        acc.expireAt = newExpire;
        acc.isActive = true;
        this.saveLocalAccounts(accounts);
      }
      return { success: true };
    }
    return { success: false, message: 'Không tìm thấy tài khoản!' };
  },

  toggleAccountStatus: function(username) {
    const accounts = this.getAccounts();
    const acc = accounts.find(a => a.username.toLowerCase() === username.trim().toLowerCase());
    if (acc) {
      const newStatus = !acc.isActive;
      const updates = { isActive: newStatus };

      // If activating an account that is expired or has past date, auto-set to 7 days from now
      if (newStatus) {
        const now = new Date();
        const exp = acc.expireAt ? new Date(acc.expireAt) : now;
        if (exp <= now) {
          const newExp = new Date();
          newExp.setDate(now.getDate() + 7);
          updates.expireAt = newExp.toISOString();
        }
      }

      if (typeof firebase !== 'undefined' && firebase.database) {
        firebase.database().ref('users/' + acc.username.toLowerCase()).update(updates);
      } else {
        acc.isActive = newStatus;
        if (updates.expireAt) acc.expireAt = updates.expireAt;
        this.saveLocalAccounts(accounts);
      }
      return { success: true, isActive: newStatus };
    }
    return { success: false };
  },

  updateAccount: function(username, newPass, remainingDays, isActive) {
    const accounts = this.getAccounts();
    const acc = accounts.find(a => a.username.toLowerCase() === username.trim().toLowerCase());
    if (!acc) return { success: false, message: 'Không tìm thấy tài khoản!' };

    const now = new Date();
    let expireAt = null;
    if (remainingDays !== null && remainingDays !== undefined && remainingDays !== '' && !isNaN(remainingDays)) {
      const exp = new Date();
      exp.setDate(now.getDate() + parseInt(remainingDays));
      expireAt = exp.toISOString();
    }

    const updates = {
      password: newPass.trim(),
      isActive: Boolean(isActive)
    };
    if (expireAt) updates.expireAt = expireAt;

    if (typeof firebase !== 'undefined' && firebase.database) {
      firebase.database().ref('users/' + acc.username.toLowerCase()).update(updates);
    } else {
      acc.password = newPass.trim();
      acc.isActive = Boolean(isActive);
      if (expireAt) acc.expireAt = expireAt;
      this.saveLocalAccounts(accounts);
    }
    return { success: true, message: 'Đã cập nhật thông tin tài khoản thành công!' };
  },

  activatePendingUsers: function(days = 7) {
    const accounts = this.getAccounts();
    const now = new Date();
    const exp = new Date();
    exp.setDate(now.getDate() + parseInt(days));
    const newExpire = exp.toISOString();

    const pendingAccounts = accounts.filter(a => !a.isActive);
    if (pendingAccounts.length === 0) {
      return { success: true, count: 0, message: 'Không có tài khoản nào đang chờ kích hoạt!' };
    }

    if (typeof firebase !== 'undefined' && firebase.database) {
      const updates = {};
      pendingAccounts.forEach(a => {
        updates['users/' + a.username.toLowerCase() + '/isActive'] = true;
        updates['users/' + a.username.toLowerCase() + '/expireAt'] = newExpire;
      });
      firebase.database().ref().update(updates);
    } else {
      pendingAccounts.forEach(a => {
        a.isActive = true;
        a.expireAt = newExpire;
      });
      this.saveLocalAccounts(accounts);
    }
    return { success: true, count: pendingAccounts.length, message: `Đã kích hoạt ${pendingAccounts.length} tài khoản đang chờ (7 ngày)!` };
  }
};

// Initialize Firebase & Auth on script load
AUTH_SERVICE.init();
