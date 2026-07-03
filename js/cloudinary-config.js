// js/cloudinary-config.js

export const cloudinaryConfig = {
    cloudName: "gntkeeno",
    uploadPreset: "Doraemon fansub Việt Nam" // Tên preset bồ vừa tạo thành công lúc nãy
};

// Đường dẫn API để lát nữa code JS của mình tự gọi lên Cloudinary để upload
export const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;