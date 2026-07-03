// js/auth.js
import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Lấy các element giao diện
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

// Lấy thêm 2 element ở cột phải (Side) để đồng bộ giao diện
const sideUserAvatar = document.getElementById('side-user-avatar');
const sideUserName = document.getElementById('side-user-name');

let isSignUpMode = false; // Mặc định ban đầu là chế độ Đăng nhập

// Lắng nghe sự kiện Mở - Đóng Modal
if (btnOpenAuth) {
    btnOpenAuth.addEventListener('click', () => {
        authModal.classList.remove('hidden');
    });
}
if (btnCloseAuth) {
    btnCloseAuth.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });
}

// Chuyển đổi qua lại giữa chế độ Đăng Nhập và Đăng Ký
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

// Xử lý sự kiện bấm nút Xác nhận (Đăng nhập / Đăng ký)
if (btnAuthSubmit) {
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
                // 1. Tạo tài khoản
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // 2. Cập nhật tên hiển thị công khai và avatar robot ngẫu nhiên
                await updateProfile(userCredential.user, {
                    displayName: username,
                    photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`
                });
                alert("Đăng ký thành công rồi nè bồ! 🎉");
            } else {
                // Thực hiện Đăng nhập
                await signInWithEmailAndPassword(auth, email, password);
                alert("Chào mừng bồ quay trở lại! ⚡");
            }
            
            // Ẩn modal và xóa sạch dữ liệu trong ô nhập
            authModal.classList.add('hidden');
            document.getElementById('auth-email').value = '';
            document.getElementById('auth-password').value = '';
            if(document.getElementById('auth-username')) document.getElementById('auth-username').value = '';

        } catch (error) {
            console.error("Lỗi Auth chi tiết:", error);
            // Bắt các mã lỗi phổ biến của Firebase để hiện thông báo tiếng Việt thân thiện
            if (error.code === 'auth/email-already-in-use') {
                alert("Email này đã được đăng ký tài khoản rồi bồ ơi!");
            } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                alert("Tài khoản hoặc mật khẩu không chính xác, bồ check lại nhé!");
            } else if (error.code === 'auth/weak-password') {
                alert("Mật khẩu yếu quá, bồ đặt từ 6 ký tự trở lên nha!");
            } else if (error.code === 'auth/invalid-email') {
                alert("Định dạng email không hợp lệ rồi bồ ơi!");
            } else {
                alert("Lỗi hệ thống: " + error.message);
            }
        } finally {
            btnAuthSubmit.disabled = false;
            btnAuthSubmit.innerText = isSignUpMode ? "Đăng Ký Tài Khoản" : "Đăng Nhập";
        }
    });
}

// Theo dõi trạng thái đăng nhập Realtime để thay đổi giao diện toàn trang
onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- TRẠNG THÁI: ĐÃ ĐĂNG NHẬP ---
        if (btnOpenAuth) btnOpenAuth.classList.add('hidden');
        if (userLoggedInZone) userLoggedInZone.classList.remove('hidden');
        
        // Hiển thị thông tin lên thanh Header trên cùng
        if (userDisplayName) userDisplayName.innerText = user.displayName || "Thành viên Doraemon Fansub";
        if (userAvatar) userAvatar.src = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;
        
        // ĐỒNG BỘ: Hiển thị thông tin xuống hộp công cụ ở Cột Phải
        if (sideUserName) sideUserName.innerText = user.displayName || "Thành viên Doraemon Fansub";
        if (sideUserAvatar) sideUserAvatar.src = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;
    } else {
        // --- TRẠNG THÁI: CHƯA ĐĂNG NHẬP / ĐĂNG XUẤT ---
        if (btnOpenAuth) btnOpenAuth.classList.remove('hidden');
        if (userLoggedInZone) userLoggedInZone.classList.add('hidden');
        
        // Trả cột phải về trạng thái Khách ẩn danh
        if (sideUserName) sideUserName.innerText = "Khách ẩn danh";
        if (sideUserAvatar) sideUserAvatar.src = `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;
    }
});

// Xử lý sự kiện bấm nút Đăng xuất
if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        if (confirm("Bồ có chắc chắn muốn đăng xuất không?")) {
            try {
                await signOut(auth);
                alert("Đã đăng xuất tài khoản thành công!");
            } catch (error) {
                console.error("Lỗi đăng xuất:", error);
            }
        }
    });
}
