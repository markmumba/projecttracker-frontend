import { useEffect, useRef, useState } from "react";
import { UserDetails } from "@/app/shared/types";
import avatar from "/public/images/user.png"
import Image from "next/image";
import UploadAvatar from "../../uploadavatar";

function LecturerCard({ userDetails, students }: {
    userDetails?: UserDetails | null | undefined,
    students?: UserDetails[] | null | undefined
}) {
    const [showStudents, setShowStudents] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const studentCount = students?.length || 0;

    const avatarUrl = userDetails?.profile_image || avatar;

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
                    <div className='text-base relative'>
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
                </div>
            </div>
        </div>
    );
}

export default LecturerCard;