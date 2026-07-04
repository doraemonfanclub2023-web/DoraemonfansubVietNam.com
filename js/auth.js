btnAuthSubmit.addEventListener('click', async () => {
    const email = document.getElementById('auth-email')?.value.trim();
    const password = document.getElementById('auth-password')?.value.trim();
    const username = document.getElementById('auth-username')?.value.trim();

    if (!email) {
        alert("Vui lòng nhập email!");
        return;
    }

    if (!password) {
        alert("Vui lòng nhập mật khẩu!");
        return;
    }

    if (password.length < 6) {
        alert("Mật khẩu phải từ 6 ký tự trở lên!");
        return;
    }

    if (isSignUpMode && !username) {
        alert("Vui lòng nhập tên hiển thị!");
        return;
    }

    try {
        btnAuthSubmit.disabled = true;
        btnAuthSubmit.innerText = "Đang xử lý...";

        if (isSignUpMode) {
            console.log("🔄 Đang tạo tài khoản:", email);

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(userCredential.user, {
                displayName: username,
                photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`
            });

            alert("✅ Tạo tài khoản thành công!");
        } else {
            console.log("🔄 Đang đăng nhập:", email);

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            alert("✅ Đăng nhập thành công!");
        }

        authModal?.classList.add('hidden');

    } catch (error) {

        console.error("🔥 Firebase Error:", error);
        console.error("🔥 Error Code:", error.code);

        let msg = "Có lỗi xảy ra!";

        switch (error.code) {
            case "auth/email-already-in-use":
                msg = "Email này đã được đăng ký.";
                break;

            case "auth/invalid-email":
                msg = "Email không hợp lệ.";
                break;

            case "auth/weak-password":
                msg = "Mật khẩu phải từ 6 ký tự trở lên.";
                break;

            case "auth/user-not-found":
                msg = "Không tìm thấy tài khoản.";
                break;

            case "auth/wrong-password":
            case "auth/invalid-credential":
                msg = "Sai email hoặc mật khẩu.";
                break;

            case "auth/network-request-failed":
                msg = "Lỗi kết nối mạng.";
                break;

            case "auth/operation-not-allowed":
                msg = "Firebase chưa bật Email/Password Authentication.";
                break;

            default:
                msg = `${error.code}\n${error.message}`;
        }

        alert(msg);

    } finally {
        btnAuthSubmit.disabled = false;
        btnAuthSubmit.innerText = isSignUpMode
            ? "Đăng Ký Tài Khoản"
            : "Đăng Nhập";
    }
});
