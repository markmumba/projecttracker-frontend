import { useEffect, useRef, useState } from "react";
import { UserDetails } from "@/app/shared/types";
import avatar from "/public/images/user.png"
import Image from "next/image";
import UploadAvatar from "../../uploadavatar";
import { useUserStore } from "@/app/shared/store";
import { axiosInstance } from "@/app/fetcher/fetcher";
import { mutate } from "swr";
import UpdateUserProfileModal from "../../updateuserprofile";

function LecturerCard({ userDetails, students }: {
    userDetails?: UserDetails | null | undefined,
    students?: UserDetails[] | null | undefined
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setUser } = useUserStore();

    const [showStudents, setShowStudents] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const studentCount = students?.length || 0;

    const avatarUrl = userDetails?.profile_image || avatar;

    const handleUpdateProfile = async (updatedData: Partial<UserDetails>) => {
        console.log('Updating user profile with:', updatedData);
        try {
            const requestBody = JSON.stringify(updatedData)
            const response = await axiosInstance.put("/users", requestBody, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.status === 200) {
                await mutate("/users");
                setUser(response.data);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
        setIsModalOpen(false);
    };

    function handleClick() {
        setShowStudents(!showStudents);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowStudents(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col p-4 rounded-lg relative">
            <div className="w-20 h-30 mx-auto mb-4">
                <Image src={avatarUrl} alt="avatar" width={300} height={300} className="w-full h-full rounded-full object-cover" />
            </div>
            {!userDetails?.profile_image && <UploadAvatar />}
            <div className="bg-gray-100 rounded-xl p-6">
                <div className="mb-1 p-4 rounded-xl">
                    <div className='text-lg font-bold'>Name</div>
                    <div className='text-base'>{userDetails?.name}</div>
                </div>

                <div className="mb-1 p-4 rounded-xl">
                    <div className='text-lg font-bold'>Students Under Supervision</div>
                    <div className='text-base relative mb-2'>
                        <button
                            onClick={handleClick}
                            className="bg-blue-400 rounded-xl px-6 py-2"
                        >
                            {studentCount}
                        </button>
                        {showStudents && students && students.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 left-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-1 overflow-auto max-h-60"
                                style={{ top: 'calc(100% + 5px)' }}
                            >
                                {students.map((student, index) => (
                                    <div key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        {student.name}
                                        <p>{student.email} </p>
                                    </div>

                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => setIsModalOpen(true)}>
                        Update Profile
                    </button>
                </div>
            </div>
            {userDetails && (
                <UpdateUserProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleUpdateProfile}
                    currentUser={{
                        name: userDetails.name,
                        email: userDetails.email
                    }}
                />
            )}
        </div>
    );
}

export default LecturerCard;