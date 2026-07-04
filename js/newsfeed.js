// ĐƯỜNG DẪN ĐÃ ĐƯỢC CHỈNH VỀ DẠNG TƯƠNG ĐỐI (./) ĐỂ TƯƠNG THÍCH VỚI GITHUB PAGES
import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// Dùng onSnapshot để dữ liệu luôn tự động cập nhật ngay khi có bài mới
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
    newsfeedContainer.innerHTML = ''; // Clear cũ
    snapshot.forEach((doc) => {
        const post = doc.data();
        // Render lại danh sách bài viết ở đây...
        console.log("Dữ liệu mới đã về!");
    });
});

const getEl = (id) => document.getElementById(id);

// Hàm upload ảnh lên Cloudinary
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    try {
        const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
        const data = await response.json();
        return data.secure_url;
    } catch (error) { 
        console.error("Lỗi upload:", error); 
        return null; 
    }
}

// Xử lý đăng bài
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

// Hiển thị Newsfeed
const newsfeedContainer = getEl('newsfeed-container');
if (newsfeedContainer) {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    onSnapshot(q, async (snapshot) => {
        newsfeedContainer.innerHTML = '';
        
        let likedPosts = [];
        if (auth.currentUser) {
            const qLikes = query(collection(db, "likes"), where("uid", "==", auth.currentUser.uid));
            const likesSnap = await getDocs(qLikes);
            likesSnap.forEach(d => likedPosts.push(d.data().postId));
        }

        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
            const date = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : '';
            const isOwner = auth.currentUser && auth.currentUser.uid === post.uid;
            const isLiked = likedPosts.includes(docSnap.id);

            const postCard = `
                <div class="post-item bg-[#16181f] rounded-2xl p-4 border border-gray-800/50 space-y-3">
                    <div class="flex items-center space-x-3">
                        <img src="${post.avatar}" class="w-10 h-10 rounded-full bg-gray-700" alt="avatar">
                        <div class="flex-1">
                            <h4 class="font-semibold text-sm text-white">${post.username}</h4>
                            <p class="text-[10px] text-gray-500">${date}</p>
                        </div>
                        <div class="relative group">
                            <button class="text-gray-400 hover:text-white p-2"><i class="fa-solid fa-ellipsis"></i></button>
                            <div class="absolute right-0 mt-0 w-32 bg-[#20232b] rounded-lg shadow-xl hidden group-hover:block z-50 border border-gray-700">
                                ${isOwner ? `<button data-id="${docSnap.id}" class="delete-btn w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400">Xóa</button>` : `<button onclick="alert('Đã báo cáo!')" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-yellow-400 rounded-lg">Báo cáo</button>`}
                            </div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-200 whitespace-pre-line">${post.content}</p>
                    ${post.mediaUrl ? `<img src="${post.mediaUrl}" class="max-h-96 w-full object-cover rounded-xl mt-2 post-image cursor-pointer" alt="post-img">` : ''}
                    <div class="flex gap-6 mt-3 border-t border-gray-800 pt-3">
                        <button data-id="${docSnap.id}" class="like-btn text-sm transition ${isLiked ? 'text-blue-500' : 'text-gray-400'}">
                            <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-thumbs-up mr-1"></i> Like
                        </button>
                        <button data-id="${docSnap.id}" class="comment-btn text-gray-400 hover:text-blue-500 transition text-sm">
                            <i class="fa-regular fa-comment mr-1"></i> Bình luận
                        </button>
                    </div>
                </div>
            `;
            newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
        });

        newsfeedContainer.onclick = async (e) => {
            const target = e.target;
            if (target.closest('.like-btn')) {
                const btn = target.closest('.like-btn');
                if (!auth.currentUser) return alert("Đăng nhập mới like được!");
                const postId = btn.dataset.id;
                const likeRef = doc(db, "likes", `${postId}_${auth.currentUser.uid}`);
                const likeSnap = await getDoc(likeRef);
                if (likeSnap.exists()) {
                    await deleteDoc(likeRef);
                    btn.className = "like-btn text-sm transition text-gray-400";
                } else {
                    await setDoc(likeRef, { postId, uid: auth.currentUser.uid, createdAt: serverTimestamp() });
                    btn.className = "like-btn text-sm transition text-blue-500";
                }
            }
            if (target.closest('.delete-btn')) {
                const btn = target.closest('.delete-btn');
                if(confirm("Xóa bài này?")) await deleteDoc(doc(db, "posts", btn.dataset.id));
            }
            if (target.closest('.comment-btn')) {
                const btn = target.closest('.comment-btn');
                const popup = document.getElementById('comment-popup');
                if (popup) {
                    popup.classList.remove('hidden');
                    popup.dataset.postId = btn.dataset.id;
                }
            }
        };
    });
}
