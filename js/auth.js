// Đảm bảo bồ đã import sendPasswordResetEmail ở đầu file auth.js
import { 
    signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ... các phần code khác của bồ ...

// Đoạn xử lý cho nút Quên mật khẩu
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
            alert("Lỗi: " + error.message);
        }
    });
}
