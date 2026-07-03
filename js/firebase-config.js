// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Giữ nguyên đống mã key dự án của bồ ở đây nhé
const firebaseConfig = {
    apiKey: "AIzaSyBt3G9n5JYu3EsvqJR9IoW2vRAc_Es3-ws",
    authDomain: "doraemon-fansub-vietnam.firebaseapp.com",
    projectId: "doraemon-fansub-vietnam",
    storageBucket: "doraemon-fansub-vietnam.appspot.com",
    messagingSenderId: "380840935390",
    appId: "1:380840935390:web:60fab4722a9fba5053a74f"
};

// Khởi tạo (Chỉ gọi duy nhất 1 lần dòng này, không khai báo lại)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Xuất biến ra cho auth.js và newsfeed.js xài
export { auth, db };
