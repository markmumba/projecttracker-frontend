// components/UploadAvatar.tsx
import { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../shared/firebaseconfig';
import { axiosInstance } from '../fetcher/fetcher';
import { v4 } from 'uuid';

function UploadAvatar() {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [isUploaded, setIsUploaded] = useState(false);

    function handleUpload() {
        if (!file) return;

        const storageRef = ref(storage, `avatars/${file.name + v4()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(currentProgress);
            },
            (error) => {
                console.error('Upload failed:', error);
                setProgress(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    axiosInstance.post(`/users/profile`, {
                        "profile_image": downloadURL,
                    }, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((response) => {
                        console.log('Avatar updated successfully');
                        setProgress(null);
                        setIsUploaded(true);
                    })
                    .catch((error) => {
                        console.error('Failed to update avatar', error);
                        setProgress(null);
                    });
                });
            }
        );
    };

    return (
        <div className="flex flex-col items-center mt-4">
            {!isUploaded ? (
                <>
                    <div className="flex items-center space-x-2 w-full">
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            className="block flex-grow text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
                        />
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                            onClick={handleUpload}
                        >
                            Upload
                        </button>
                    </div>
                    {progress !== null && (
                        <div className="mt-2 text-gray-500">Progress: {progress.toFixed(2)}%</div>
                    )}
                </>
            ) : (
                <div className="text-green-500 font-semibold">Avatar uploaded successfully!</div>
            )}
        </div>
    );
};

export default UploadAvatar;