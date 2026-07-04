import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Helper lấy phần tử an toàn
const getEl = (id) => document.getElementById(id);

// Các biến cần dùng
const btnAuthSubmit = getEl('btnAuthSubmit');
const authModal = getEl('auth-modal');
let isSignUpMode = false; // Mặc định là Đăng nhập

// 1. Theo dõi trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    const userLoggedIn = getEl('user-logged-in');
    const btnOpenAuth = getEl('btn-open-auth-modal');
    const postButton = getEl('btn-open-post-modal');

    if (user) {
        // Nếu đã đăng nhập, ẩn nút Đăng nhập, hiện thông tin user
        userLoggedIn?.classList.remove('hidden');
        btnOpenAuth?.classList.add('hidden');
        
        // Kích hoạt nút Đăng bài
        if (postButton) {
            postButton.disabled = false;
            postButton.classList.remove('bg-gray-800', 'text-gray-500', 'cursor-not-allowed');
            postButton.classList.add('bg-blue-600', 'text-white');
            postButton.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Tạo bài viết';
        }
        
        if (getEl('user-display-name')) getEl('user-display-name').innerText = user.displayName || "Thành viên";
        if (getEl('user-avatar')) getEl('user-avatar').src = user.photoURL || "";
        if (getEl('side-user-name')) getEl('side-user-name').innerText = user.displayName || "Thành viên";
        if (getEl('side-user-avatar')) getEl('side-user-avatar').src = user.photoURL || "";
    } else {
        // Nếu chưa đăng nhập
        userLoggedIn?.classList.add('hidden');
        btnOpenAuth?.classList.remove('hidden');
        
        // Khóa nút Đăng bài
        if (postButton) {
            postButton.disabled = true;
            postButton.classList.add('bg-gray-800', 'text-gray-500', 'cursor-not-allowed');
            postButton.innerHTML = '<i class="fa-solid fa-lock text-xs"></i> Đăng nhập để tạo bài';
        }
    }
});

// 2. Xử lý nút Đăng nhập / Đăng ký
btnAuthSubmit?.addEventListener('click', async () => {
    const email = getEl('auth-email')?.value.trim();
    const password = getEl('auth-password')?.value.trim();
    const username = getEl('auth-username')?.value.trim();

    if (!email || !password) return alert("Bồ ơi, nhập email và mật khẩu nha!");
    if (password.length < 6) return alert("Mật khẩu cần ít nhất 6 ký tự!");

    try {
        btnAuthSubmit.disabled = true;
        btnAuthSubmit.innerText = "Đang xử lý...";

        if (isSignUpMode) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: username,
                photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`
            });
            alert("✅ Tạo tài khoản thành công!");
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            alert("✅ Chào mừng bồ quay trở lại!");
        }
        authModal?.classList.add('hidden');
    } catch (error) {
        console.error("Firebase Error:", error);
        alert("Lỗi: " + error.message);
    } finally {
        btnAuthSubmit.disabled = false;
        btnAuthSubmit.innerText = isSignUpMode ? "Đăng Ký Tài Khoản" : "Đăng Nhập";
    }
});

// 3. Xử lý Đăng xuất
getEl('btn-logout')?.addEventListener('click', () => signOut(auth));
