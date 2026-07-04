import { auth, db } from './firebase-config.js';
import { cloudinaryConfig, CLOUDINARY_URL } from './cloudinary-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
    const data = await response.json();
    return data.secure_url;
}

document.getElementById('btn-submit-post').addEventListener('click', async () => {
    const content = document.getElementById('post-content').value.trim();
    const fileInput = document.getElementById('post-file');
    const file = fileInput.files[0];
    const btnSubmit = document.getElementById('btn-submit-post');
    const user = auth.currentUser;

    if (!user) return alert("Bồ ơi, đăng nhập mới đăng bài được nha!");
    if (!content && !file) return alert('Nhập nội dung hoặc chọn ảnh đã nhé!');

    try {
        btnSubmit.disabled = true;
        let mediaUrl = file ? await uploadToCloudinary(file) : '';
        await addDoc(collection(db, "posts"), {
            username: user.displayName || "Thành viên",
            avatar: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=mon",
            content: content,
            mediaUrl: mediaUrl,
            createdAt: serverTimestamp()
        });
        document.getElementById('post-content').value = '';
        document.getElementById('post-modal').classList.add('hidden');
        alert('Đăng bài thành công!');
    } catch (e) { console.error(e); } finally { btnSubmit.disabled = false; }
});

const newsfeedContainer = document.getElementById('newsfeed-container');
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    newsfeedContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const post = doc.data();
        const postCard = `
            <div class="post-item bg-[#16181f] rounded-2xl p-4 border border-gray-800/50 space-y-3">
                <div class="flex items-center space-x-3">
                    <img src="${post.avatar}" class="w-10 h-10 rounded-full">
                    <h4 class="font-semibold text-sm">${post.username}</h4>
                </div>
                <p class="text-sm text-gray-200">${post.content}</p>
                ${post.mediaUrl ? `<img src="${post.mediaUrl}" class="w-full rounded-xl">` : ''}
            </div>
        `;
        newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
    });
});

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        document.querySelectorAll('.post-item').forEach(post => {
            post.style.display = post.innerText.toLowerCase().includes(keyword) ? 'block' : 'none';
        });
    });
}
