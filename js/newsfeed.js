import { db, auth } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, deleteDoc, getDocs, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const getEl = (id) => document.getElementById(id);
const newsfeedContainer = getEl('newsfeed-container'); 

// Xử lý đăng bài
const btnSubmitPost = getEl('btn-submit-post');
if (btnSubmitPost) {
    btnSubmitPost.addEventListener('click', async () => {
        const content = getEl('post-content')?.value.trim();
        const user = auth.currentUser;
        if (!user) return alert("Đăng nhập mới đăng bài được!");
        if (!content) return alert('Nhập nội dung!');
        try {
            btnSubmitPost.disabled = true;
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                username: user.displayName || "Thành viên",
                avatar: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=mon",
                content: content,
                createdAt: serverTimestamp()
            });
            getEl('post-content').value = '';
        } catch (e) { console.error(e); } finally { btnSubmitPost.disabled = false; }
    });
}

// Hiển thị Newsfeed
if (newsfeedContainer) {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    onSnapshot(q, async (snapshot) => {
        newsfeedContainer.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
            const postCard = `<div>${post.username}: ${post.content}</div>`;
            newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
        });
    });
}
