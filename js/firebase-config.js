// js/firebase-config.js

// ĐÃ SỬA: Thay đổi đường dẫn import từ "firebase/app" thành link CDN của Google để chạy được trên web thuần
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Cấu hình Firebase thực tế của bồ
const firebaseConfig = {
  apiKey: "AIzaSyBt3G9n5JYu3EsvqJR9IoW2vRAc_Es3-ws",
  authDomain: "doraemon-fansub-vietnam.firebaseapp.com",
  projectId: "doraemon-fansub-vietnam",
  storageBucket: "doraemon-fansub-vietnam.firebasestorage.app",
  messagingSenderId: "380840935390",
  appId: "1:380840935390:web:60fab4722a9fba5053a74f",
  measurementId: "G-0S2Z4XRK0B"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// ĐÃ SỬA: Khởi tạo Firestore và export biến "db" ra ngoài để file newsfeed.js có thể liên kết dữ liệu
export const db = getFirestore(app);