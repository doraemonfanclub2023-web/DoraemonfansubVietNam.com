// ... (các import của bồ)

// 1. Logic đóng mở modal
const btnOpenAuth = document.getElementById('btn-open-auth-modal');
const authModal = document.getElementById('auth-modal');

btnOpenAuth.addEventListener('click', () => {
    authModal.classList.remove('hidden'); // Mở pop-up
});

// Đóng modal khi nhấn ra ngoài (tùy chọn)
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.add('hidden');
});

// 2. Logic Quên mật khẩu (Pop-up thông báo)
const btnForgotPassword = document.getElementById('btn-forgot-password');
btnForgotPassword.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    if (!email) return alert("Bồ nhập email vào ô trên trước nha!");
    
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Đã gửi email khôi phục. Bồ check hòm thư nhé!");
        authModal.classList.add('hidden'); // Đóng modal sau khi gửi thành công
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
});
