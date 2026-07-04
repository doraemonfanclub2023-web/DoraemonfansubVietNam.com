import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, createUserWithEmailAndPassword, 
    updateProfile, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const btnAuthSubmit = document.getElementById('btnAuthSubmit');
const authModal = document.getElementById('auth-modal');

// Sự kiện click Đăng nhập
btnAuthSubmit.addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const username = document.getElementById('auth-username').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Đăng nhập thành công!");
        authModal.classList.add('hidden');
    } catch (e) {
        alert("Lỗi: " + e.message);
    }
});

// Hiển thị UI khi đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-logged-in').classList.remove('hidden');
        document.getElementById('btn-open-auth-modal').classList.add('hidden');
        document.getElementById('user-display-name').innerText = user.displayName;
    }
});

document.getElementById('btn-open-auth-modal').onclick = () => authModal.classList.remove('hidden');
document.getElementById('btn-logout').onclick = () => signOut(auth).then(() => location.reload());
