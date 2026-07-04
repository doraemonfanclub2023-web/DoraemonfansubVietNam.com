import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const authModal = document.getElementById('auth-modal');
const btnOpenAuth = document.getElementById('btn-open-auth-modal');
const btnCloseAuth = document.getElementById('btn-close-auth-modal');
const btnToggleMode = document.getElementById('btn-toggle-auth-mode');
const btnAuthSubmit = document.getElementById('btn-auth-submit');
const authTitle = document.getElementById('auth-modal-title');
const usernameGroup = document.getElementById('auth-username-group');
const toggleText = document.getElementById('auth-toggle-text');
const userLoggedInZone = document.getElementById('user-logged-in');
const userAvatar = document.getElementById('user-avatar');
const userDisplayName = document.getElementById('user-display-name');
const btnLogout = document.getElementById('btn-logout');
const sideUserAvatar = document.getElementById('side-user-avatar');
const sideUserName = document.getElementById('side-user-name');

let isSignUpMode = false;

if (btnOpenAuth) btnOpenAuth.addEventListener('click', () => authModal.classList.remove('hidden'));
if (btnCloseAuth) btnCloseAuth.addEventListener('click', () => authModal.classList.add('hidden'));

if (btnToggleMode) {
    btnToggleMode.addEventListener('click', () => {
        isSignUpMode = !isSignUpMode;
        if (isSignUpMode) {
            authTitle.innerText = "Tạo Tài Khoản Mới";
            usernameGroup.classList.remove('hidden');
            btnAuthSubmit.innerText = "Đăng Ký Tài Khoản";
            toggleText.innerText = "Đã có tài khoản?";
            btnToggleMode.innerText = "Đăng nhập";
        } else {
            authTitle.innerText = "Đăng Nhập Toàn Cầu";
            usernameGroup.classList.add('hidden');
            btnAuthSubmit.innerText = "Đăng Nhập";
            toggleText.innerText = "Chưa có tài khoản?";
            btnToggleMode.innerText = "Đăng ký ngay";
        }
    });
}

btnAuthSubmit.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const username = document.getElementById('auth-username').value.trim();

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
        authModal.classList.add('hidden');
    } catch (error) {
        alert("Lỗi: " + error.message);
    } finally {
        btnAuthSubmit.disabled = false;
        btnAuthSubmit.innerText = isSignUpMode ? "Đăng Ký Tài Khoản" : "Đăng Nhập";
    }
});

onAuthStateChanged(auth, (user) => {
    const btnPost = document.getElementById('btn-open-post-modal');
    if (user) {
        if (btnOpenAuth) btnOpenAuth.classList.add('hidden');
        if (userLoggedInZone) userLoggedInZone.classList.remove('hidden');
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
        if (btnOpenAuth) btnOpenAuth.classList.remove('hidden');
        if (userLoggedInZone) userLoggedInZone.classList.add('hidden');
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
