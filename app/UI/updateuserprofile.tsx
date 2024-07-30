import { useState } from 'react';
import { UserDetails } from '../shared/types';
import { BellAlertIcon, SunIcon } from '@heroicons/react/24/solid';
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';




function UpdateUserProfileModal({ isOpen, onClose, onUpdate, currentUser }: {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (userData: Partial<UserDetails> & { password?: string }) => Promise<void>;
    currentUser: UserDetails;
}) {
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const updatedData: Partial<UserDetails> & { password?: string } = {};
        if (name !== currentUser.name) updatedData.name = name;
        if (email !== currentUser.email) updatedData.email = email;
        if (password) updatedData.password = password;

        try {
            await onUpdate(updatedData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">New Password (optional)</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block mb-2">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {error && (
                        <>
                            <BellAlertIcon color='red' />
                            <ExclamationTriangleIcon>Error</ExclamationTriangleIcon>
                            <p>{error}</p>
                        </>
                    )}
                    {success && (
                        <>
                            <BellAlertIcon color='green' />
                            <SunIcon color='green'>Success</SunIcon>
                            <p>Profile updated successfully!</p>
                        </>
                    )}
                    <div className="flex justify-end mt-4">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserProfileModal;