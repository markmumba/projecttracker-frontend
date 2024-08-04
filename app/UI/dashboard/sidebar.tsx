'use client';
import Link from 'next/link';
import { PowerIcon } from '@heroicons/react/24/outline';
import NavLinks from './navlinks';
import { axiosInstance } from '../../fetcher/fetcher';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUserStore } from '@/app/shared/store';
import { useState } from 'react';
import Spinner from '../spinner';
import { mutate } from 'swr';
import ConfirmationModal from './confirmlogout';

function SideNav() {
    const router = useRouter();
    const resetUser = useUserStore((state) => state.resetUser);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function signOut() {
        setIsLoading(true);
        try {
            await axiosInstance.get('/logout');
            resetUser();
            setAccessToken(null);
            mutate(() => true, undefined, { revalidate: false });
            sessionStorage.removeItem('auth-storage');
            await router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 md:w-64">
            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
                href="/"
            >
                <div className="w-32 text-white md:w-40 text-2xl font-bold  items-center">
                    Project Tracker
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks />
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white flex  rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    <PowerIcon className="w-6 mx-4" />
                    {isLoading ? 'Logging out...' : 'Sign Out'}
                </button>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={signOut}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
            />
        </div>
    );
}

export default SideNav;

