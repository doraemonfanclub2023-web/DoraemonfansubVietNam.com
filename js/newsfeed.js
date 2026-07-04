import { auth, db } from './firebase-config.js';
import { cloudinaryConfig, CLOUDINARY_URL } from './cloudinary-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const getEl = (id) => document.getElementById(id);

// Hàm upload ảnh giữ nguyên
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    try {
        const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Lỗi upload Cloudinary:", error);
        return null;
    }
}

// Xử lý đăng bài... (phần cũ của bồ giữ nguyên)
const btnSubmitPost = getEl('btn-submit-post');
if (btnSubmitPost) {
    btnSubmitPost.addEventListener('click', async () => {
        const content = getEl('post-content')?.value.trim();
        const fileInput = getEl('post-file');
        const file = fileInput?.files[0];
        const user = auth.currentUser;

        if (!user) return alert("Bồ ơi, đăng nhập mới đăng bài được nha!");
        if (!content && !file) return alert('Nhập nội dung hoặc chọn ảnh đã nhé!');

        try {
            btnSubmitPost.disabled = true;
            btnSubmitPost.innerText = 'Đang đăng...';
            let mediaUrl = file ? await uploadToCloudinary(file) : '';
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                username: user.displayName || "Thành viên",
                avatar: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=mon",
                content: content,
                mediaUrl: mediaUrl,
                createdAt: serverTimestamp()
            });
            if (getEl('post-content')) getEl('post-content').value = '';
            if (fileInput) fileInput.value = '';
            alert('Đăng bài thành công!');
        } catch (e) { 
            console.error("Lỗi đăng bài:", e); 
        } finally { 
            btnSubmitPost.disabled = false; 
            btnSubmitPost.innerText = 'Đăng bài lên Bản Tin';
        }
    });
}

// Render danh sách bài viết (ĐÃ SỬA)
const newsfeedContainer = getEl('newsfeed-container');
if (newsfeedContainer) {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        newsfeedContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const post = doc.data();
            const date = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : '';
            
            const postCard = `
                <div class="post-item bg-[#16181f] rounded-2xl p-4 border border-gray-800/50 space-y-3">
                    <div class="flex items-center space-x-3">
                        <img src="${post.avatar}" class="w-10 h-10 rounded-full bg-gray-700">
                        <div>
                            <h4 class="font-semibold text-sm text-white">${post.username}</h4>
                            <p class="text-[10px] text-gray-500">${date}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-200">${post.content}</p>
                    
                    <!-- ẢNH ĐÃ GIỚI HẠN KÍCH THƯỚC (max-h-96, w-full, object-cover) -->
                    ${post.mediaUrl ? `<img src="${post.mediaUrl}" class="max-h-96 w-full object-cover rounded-xl mt-2">` : ''}
                    
                    <!-- NÚT LIKE VÀ BÌNH LUẬN -->
                    <div class="flex gap-6 mt-3 border-t border-gray-800 pt-3">
                        <button class="text-gray-400 hover:text-blue-500 transition text-sm">
                            <i class="fa-regular fa-thumbs-up mr-1"></i> Like
                        </button>
                        <button class="text-gray-400 hover:text-blue-500 transition text-sm">
                            <i class="fa-regular fa-comment mr-1"></i> Bình luận
                        </button>
                    </div>
                </div>
            `;
            newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
        });
    });
}
