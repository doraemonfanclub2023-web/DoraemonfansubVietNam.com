// js/newsfeed.js
import { db } from './firebase-config.js';
import { cloudinaryConfig, CLOUDINARY_URL } from './cloudinary-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Hàm xử lý upload file lên Cloudinary
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    const response = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload file thất bại!');
    const data = await response.json();
    return data.secure_url;
}

// Lắng nghe sự kiện bấm nút "Đăng bài"
document.getElementById('btn-submit-post').addEventListener('click', async () => {
    const content = document.getElementById('post-content').value.trim();
    const fileInput = document.getElementById('post-file');
    const file = fileInput.files[0];
    const btnSubmit = document.getElementById('btn-submit-post');

    if (!content && !file) {
        alert('Bồ ơi, nhập nội dung hoặc chọn ảnh/video đã nhé!');
        return;
    }

    try {
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Đang đăng bài...';

        let mediaUrl = '';
        if (file) mediaUrl = await uploadToCloudinary(file);

        await addDoc(collection(db, "posts"), {
            username: "nguyễn tuấn khải",
            avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=mon",
            content: content,
            mediaUrl: mediaUrl,
            createdAt: serverTimestamp()
        });

        document.getElementById('post-content').value = '';
        fileInput.value = '';
        document.getElementById('post-modal').classList.add('hidden');
        alert('Đăng bài thành công rồi nè bồ! 🎉');

    } catch (error) {
        console.error("Lỗi:", error);
        alert('Có lỗi xảy ra rồi bồ ơi!');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = 'Đăng bài lên Bản Tin';
    }
});

// Lắng nghe dữ liệu Realtime để đổ ra màn hình
const newsfeedContainer = document.getElementById('newsfeed-container');
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    newsfeedContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const post = doc.data();
        const postTime = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString('vi-VN') : 'Vừa xong';

        let mediaHtml = '';
        if (post.mediaUrl) {
            if (post.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) || post.mediaUrl.includes('/video/upload/')) {
                mediaHtml = `<video src="${post.mediaUrl}" controls class="w-full rounded-xl max-h-[450px] object-cover bg-black"></video>`;
            } else {
                mediaHtml = `<img src="${post.mediaUrl}" alt="Post Media" class="w-full rounded-xl max-h-[500px] object-cover">`;
            }
        }

        const postCard = `
            <div class="bg-[#16181f] rounded-2xl p-4 border border-gray-800/50 space-y-3">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <img src="${post.avatar}" alt="Avatar" class="w-10 h-10 rounded-full bg-gray-700">
                        <div>
                            <h4 class="font-semibold text-sm hover:underline cursor-pointer">${post.username}</h4>
                            <span class="text-xs text-gray-500">${postTime}</span>
                        </div>
                    </div>
                </div>
                <p class="text-sm text-gray-200 whitespace-pre-wrap">${post.content}</p>
                ${mediaHtml}
                <div class="flex items-center space-x-6 pt-2 text-gray-400 text-sm border-t border-gray-800/60">
                    <button class="hover:text-red-500 flex items-center space-x-2"><i class="fa-regular fa-heart"></i> <span>0</span></button>
                    <button class="hover:text-blue-500 flex items-center space-x-2"><i class="fa-regular fa-comment"></i> <span>0</span></button>
                </div>
            </div>
        `;
        newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
    });
});