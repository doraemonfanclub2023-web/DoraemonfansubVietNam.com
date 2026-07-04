// Đảm bảo bồ đã import sendPasswordResetEmail từ firebase/auth
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Đăng nhập
document.getElementById('btnAuthSubmit').addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Đăng nhập thành công!");
        location.reload(); // Tải lại để cập nhật UI
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
});

// Quên mật khẩu
document.getElementById('btn-forgot-password').addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    if (!email) return alert("Nhập email trước đã bồ ơi!");
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Đã gửi email khôi phục!");
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
});
// ... code khác của bồ ...

// Xử lý nút Quên mật khẩu
const btnForgotPassword = document.getElementById('btn-forgot-password');

if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', async () => {
        const emailInput = document.getElementById('auth-email');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert("Bồ vui lòng nhập email vào ô trên trước nhé!");
            return;
        }
        
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Đã gửi email khôi phục mật khẩu. Bồ kiểm tra hộp thư nhé!");
        } catch (error) {
            console.error("Lỗi gửi email:", error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    });
}
