import { db, auth } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const getEl = (id) => document.getElementById(id);
const newsfeedContainer = getEl('newsfeed-container');

// Xử lý đăng bài
const btnSubmitPost = getEl('btn-submit-post');
if (btnSubmitPost) {
    btnSubmitPost.addEventListener('click', async () => {
        const content = getEl('post-content')?.value.trim();
        const user = auth.currentUser;

        console.log("User hiện tại:", user); // Kiểm tra xem đã đăng nhập chưa

        if (!user) {
            alert("Bồ chưa đăng nhập kìa!");
            return;
        }
        if (!content) {
            alert('Nhập nội dung đi bồ!');
            return;
        }

        try {
            btnSubmitPost.disabled = true;
            btnSubmitPost.innerText = "Đang đăng...";
            
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                username: user.displayName || "Thành viên",
                avatar: user.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=mon",
                content: content,
                createdAt: serverTimestamp()
            });

            getEl('post-content').value = '';
            console.log("Đăng bài thành công!");
        } catch (e) {
            console.error("Lỗi khi đăng bài:", e);
            alert("Có lỗi xảy ra: " + e.message);
        } finally {
            btnSubmitPost.disabled = false;
            btnSubmitPost.innerText = "Đăng bài";
        }
    });
}

// Hiển thị Newsfeed
if (newsfeedContainer) {
    try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            newsfeedContainer.innerHTML = '';
            snapshot.forEach((docSnap) => {
                const post = docSnap.data();
                // Bọc trong thẻ div có class cho đẹp
                const postCard = `
                    <div class="bg-[#16181f] p-4 rounded-xl border border-gray-800">
                        <p class="font-bold text-blue-400">${post.username || "Thành viên"}</p>
                        <p class="text-white mt-1">${post.content}</p>
                    </div>`;
                newsfeedContainer.insertAdjacentHTML('beforeend', postCard);
            });
        });
    } catch (e) {
        console.error("Lỗi tải newsfeed:", e);
								<script type="module" src="js/newsfeed.js"></script>
    }
}
