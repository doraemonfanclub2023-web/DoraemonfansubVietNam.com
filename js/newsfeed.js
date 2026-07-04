import { auth, db } from './firebase-config.js';
import { cloudinaryConfig, CLOUDINARY_URL } from './cloudinary-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const getEl = (id) => document.getElementById(id);

// 1. Hàm upload ảnh
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    try {
        const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await response.json();
        return data.secure_url;
    } catch (error) { console.error("Lỗi upload:", error); return null; }
}

// 2. Xử lý đăng bài
const btnSubmitPost = getEl('btn-submit-post');
if (btnSubmitPost) {
    btnSubmitPost.addEventListener('click', async () => {
        const content = getEl('post-content')?.value.trim();
        const file = getEl('post-file')?.files[0];
        const user = auth.currentUser;

        if (!user) return alert("Đăng nhập mới đăng bài được nha!");
        if (!content && !file) return alert('Nhập nội dung hoặc chọn ảnh!');

        try {
            btnSubmitPost.disabled = true;
            let mediaUrl = file ? await uploadToCloudinary(file) : '';
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                username: user.displayName || "Thành viên",
                avatar: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=mon",
                content: content,
                mediaUrl: mediaUrl,
                createdAt: serverTimestamp()
            });
            getEl('post-content').value = '';
            getEl('post-file').value = '';
        } catch (e) { console.error(e); } finally { btnSubmitPost.disabled = false; }
    });
}

// 3. Render danh sách bài viết
const newsfeedContainer = getEl('newsfeed-container');
if (newsfeedContainer) {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        newsfeedContainer.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
            const date = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : '';
            const isOwner = auth.currentUser && auth.currentUser.uid === post.uid;

            const postCard = `
                <div class="post-item bg-[#16181f] rounded-2xl p-4 border border-gray-800/50 space-y-3">
                    <div class="flex items-center space-x-3">
                        <img src="${post.avatar}" class="w-10 h-10 rounded-full bg-gray-700">
                        <div class="flex-1">
                            <h4 class="font-semibold text-sm text-white">${post.username}</h4>
                            <p class="text-[10px] text-gray-500">${date}</p>
                        </div>
                        ${isOwner ? `
                        <div class="relative group">
                            <button class="text-gray-400 hover:text-white p-2"><i class="fa-solid fa-ellipsis"></i></button>
                            <div class="absolute right-0 mt-2 w-32 bg-[#20232b] rounded-lg shadow-xl hidden group-hover:block z-10 border border-gray-700">
                                <button onclick="alert('Tính năng sửa đang phát triển!')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-blue-400">Sửa</button>
                                <button data-id="${docSnap.id}" class="delete-btn w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400">Xóa</button>
                            </div>
                        </div>` : ''}
                    </div>
                    <p class="text-sm text-gray-200">${post.content}</p>
                    ${post.mediaUrl ? `<img src="${post.mediaUrl}" class="post-image max-h-96 w-full object-cover rounded-xl mt-2 cursor-pointer">` : ''}
                    <div class="flex gap-6 mt-3 border-t border-gray-800 pt-3">
                        <button class="like-btn text-gray-400 hover:text-blue-500 transition text-sm">
                            <i class="fa-regular fa-thumbs-up mr-1"></i> Like
                        </button>
                        <button class="comment-btn text-gray-400 hover:text-blue-500 transition text-sm">
                            <i class="fa-regular fa-comment mr-1"></i> Bình luận
                        </button>
                    </div>
                </div>
            `;
            newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
        });

        // Xử lý Xóa
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = async () => {
                if(confirm("Bồ chắc chắn muốn xóa bài này?")) {
                    await deleteDoc(doc(db, "posts", btn.dataset.id));
                }
            };
        });

        // Xử lý Like & Comment
        newsfeedContainer.querySelectorAll('.like-btn').forEach(btn => {
            btn.onclick = () => {
                btn.classList.toggle('text-blue-500'); btn.classList.toggle('text-gray-400');
                const icon = btn.querySelector('i');
                icon.classList.toggle('fa-regular'); icon.classList.toggle('fa-solid');
            };
        });
    });
}
