// Thêm hàm sendPasswordResetEmail vào phần import của bồ
import { 
    signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail // Thêm hàm này
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ... (phần code cũ của bồ giữ nguyên)

// Thêm đoạn xử lý này vào cuối file
const btnForgotPassword = document.getElementById('btn-forgot-password');

if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        if (!email) {
            alert("Bồ nhập email vào ô trên trước nha!");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Đã gửi email khôi phục mật khẩu. Bồ kiểm tra hộp thư nhé!");
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra: " + error.message);
        }
    });
}
