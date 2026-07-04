// Đảm bảo bồ đã import sendPasswordResetEmail từ firebase/auth
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
