import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Bộ quét ID thông minh để kiểm tra lỗi HTML
const getEl = (id) => {
    const el = document.getElementById(id);
    if (el) {
        console.log(`✅ [auth.js] Đã kết nối thành công với ID: "${id}"`);
    } else {
        console.error(`❌ [auth.js] KHÔNG tìm thấy ID: "${id}" trong file HTML của bồ!`);
    }
    return el;
};

console.log("====== 🔍 BẮT ĐẦU QUÉT LỖI GIAO DIỆN ĐĂNG NHẬP ======");
const authModal = getEl('auth-modal');
const btnOpenAuth = getEl('btn-open-auth-modal');
const btnCloseAuth = getEl('btn-close-auth-modal');
const btnToggleMode = getEl('btn-toggle-auth-mode');
const btnAuthSubmit = getEl('btn-auth-submit');
const authTitle = getEl('auth-modal-title');
const usernameGroup = getEl('auth-username-group');
const toggleText = getEl('auth-toggle-text');
const userLoggedInZone = getEl('user-logged-in');
const userAvatar = getEl('user-avatar');
const userDisplayName = getEl('user-display-name');
const btnLogout = getEl('btn-logout');
const sideUserAvatar = getEl('side-user-avatar');
const sideUserName = getEl('side-user-name');
const btnPost = getEl('btn-open-post-modal');
console.log("====================================================");

let isSignUpMode = false;

if (btnOpenAuth) btnOpenAuth.addEventListener('click', () => authModal?.classList.remove('hidden'));
if (btnCloseAuth) btnCloseAuth.addEventListener('click', () => authModal?.classList.add('hidden'));

if (btnToggleMode) {
    btnToggleMode.addEventListener('click', () => {
        isSignUpMode = !isSignUpMode;
        if (isSignUpMode) {
            if(authTitle) authTitle.innerText = "Tạo Tài Khoản Mới";
            usernameGroup?.classList.remove('hidden');
            if(btnAuthSubmit) btnAuthSubmit.innerText = "Đăng Ký Tài Khoản";
            if(toggleText) toggleText.innerText = "Đã có tài khoản?";
            if(btnToggleMode) btnToggleMode.innerText = "Đăng nhập";
        } else {
            if(authTitle) authTitle.innerText = "Đăng Nhập Toàn Cầu";
            usernameGroup?.classList.add('hidden');
            if(btnAuthSubmit) btnAuthSubmit.innerText = "Đăng Nhập";
            if(toggleText) toggleText.innerText = "Chưa có tài khoản?";
            if(btnToggleMode) btnToggleMode.innerText = "Đăng ký ngay";
        }
    });
}

if (btnAuthSubmit) {
    btnAuthSubmit.addEventListener('click', async () => {
        const email = document.getElementById('auth-email')?.value.trim();
        const password = document.getElementById('auth-password')?.value.trim();
        const username = document.getElementById('auth-username')?.value.trim();

        if (!email || !password || (isSignUpMode && !username)) {
            alert("Bồ ơi, vui lòng điền đầy đủ thông tin nha!");
            return;
        }

        try {
            btnAuthSubmit.disabled = true;
            btnAuthSubmit.innerText = "Đang xử lý...";
            if (isSignUpMode) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: username,
                    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`
                });
                alert("Đăng ký thành công!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Chào mừng bồ quay trở lại!");
            }
            authModal?.classList.add('hidden');
        } catch (error) {
            alert("Lỗi đăng nhập/đăng ký: " + error.message);
        } finally {
            btnAuthSubmit.disabled = false;
            btnAuthSubmit.innerText = isSignUpMode ? "Đăng Ký Tài Khoản" : "Đăng Nhập";
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        btnOpenAuth?.classList.add('hidden');
        userLoggedInZone?.classList.remove('hidden');
        if (userDisplayName) userDisplayName.innerText = user.displayName || "Thành viên";
        if (userAvatar) userAvatar.src = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;
        if (sideUserName) sideUserName.innerText = user.displayName || "Thành viên";
        if (sideUserAvatar) sideUserAvatar.src = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;
        
        if (btnPost) {
            btnPost.disabled = false;
            btnPost.classList.remove('bg-gray-800', 'text-gray-500', 'cursor-not-allowed');
            btnPost.classList.add('bg-[#248a3d]', 'text-white');
            btnPost.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Tạo bài viết';
        }
    } else {
        btnOpenAuth?.classList.remove('hidden');
        userLoggedInZone?.classList.add('hidden');
        if (sideUserName) sideUserName.innerText = "Khách ẩn danh";
        if (sideUserAvatar) sideUserAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;
        
        if (btnPost) {
            btnPost.disabled = true;
            btnPost.classList.add('bg-gray-800', 'text-gray-500', 'cursor-not-allowed');
            btnPost.classList.remove('bg-[#248a3d]', 'text-white');
            btnPost.innerHTML = '<i class="fa-solid fa-lock text-xs"></i> Đăng nhập để tạo bài';
        }
    }
});

if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        if (confirm("Đăng xuất không bồ?")) await signOut(auth);
    });
}
