'use client';
import { ProjectDetails, UserDetails } from "@/app/shared/types";
import avatar from "@/public/images/user.png"
import TimeRemaining from "./timeremaining";
import Image, { StaticImageData } from "next/image";
import UploadAvatar from "../../uploadavatar";
import { useState } from "react";
import UpdateUserProfileModal from "../../updateuserprofile";
import { axiosInstance } from "@/app/fetcher/fetcher";
import { useUserStore } from "@/app/shared/store";
import { mutate } from "swr";



function StudentCard({
  userDetails,
  projectDetails,
  submissionCount
}: {
  userDetails?: UserDetails | null | undefined;
  projectDetails?: ProjectDetails | null | undefined;
  submissionCount?: number | undefined;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarUrl: string | undefined = userDetails?.profile_image || (avatar as unknown as string);
  const { setUser } = useUserStore();


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

  return (
    <>
      <div className="flex flex-col p-4 rounded-lg">
        <div className="relative w-[120px] h-[120px] rounded-full mx-auto mb-4 overflow-hidden">
          <img
            src={avatarUrl}
            width={120}
            height={120}
            alt="avatar"
            className="object-cover"
            onError={(e) => {
              console.error("Error loading image:", e);
            }}
          />
        </div>
        {!userDetails?.profile_image && <UploadAvatar />}
        <div className="bg-gray-100 rounded-xl p-6">
          <div className="mb-1 p-4 rounded-xl">
            <div className="text-lg font-bold">Name</div>
            <div className="text-base">{userDetails?.name}</div>
          </div>
          <div className="mb-1 p-4 rounded-xl">
            <div className="text-lg font-bold">Project Title</div>
            <div className="text-base">{projectDetails?.title}</div>
          </div>
          <div className="mb-1 p-4 rounded-xl">
            <div className='text-lg font-bold '>Supervisor Name</div>
            <div className='text-base'>{projectDetails?.lecturer.name}</div>
          </div>
          <div className="mb-1 p-4 rounded-xl">
            <div className="text-lg font-bold">Submissions</div>
            <div className="text-base">{submissionCount}</div>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Update Profile
          </button>
        </div>
      </div>
      <TimeRemaining projectDetails={projectDetails} />
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
    </>
  );
}

export default StudentCard;
