// Thêm 2 dòng này vào bên trong nhánh "if (user)" của file js/auth.js nhé bồ:
document.getElementById('side-user-name').innerText = user.displayName || "Thành viên Mon Fansub";
document.getElementById('side-user-avatar').src = user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=mon`;