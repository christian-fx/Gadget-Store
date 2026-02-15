// Cloudinary configuration
const cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
};

export const CloudinaryService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('folder', 'products');

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Cloudinary API Error:', data);
                throw new Error(data.error?.message || 'Upload failed');
            }

            return data.secure_url;
        } catch (error) {
            console.error('Cloudinary Upload Service Error:', error);
            throw error; // Propagate to form for alert
        }
    }
};
