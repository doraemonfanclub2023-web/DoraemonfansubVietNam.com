// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Giữ nguyên đống mã key dự án của bồ ở đây nhé
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "doraemon-fansub-vietnam.firebaseapp.com",
    projectId: "doraemon-fansub-vietnam",
    storageBucket: "doraemon-fansub-vietnam.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Khởi tạo (Chỉ gọi duy nhất 1 lần dòng này, không khai báo lại)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Xuất biến ra cho auth.js và newsfeed.js xài
export { auth, db };
