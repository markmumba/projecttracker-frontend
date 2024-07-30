'use client';
import { ProjectDetails, UserDetails } from "@/app/shared/types";
import avatar from "@/public/images/user.png"
import TimeRemaining from "./timeremaining";
import Image, { StaticImageData } from "next/image";
import UploadAvatar from "../../uploadavatar";
import { useState } from "react";
import UpdateUserProfileModal from "../../updateuserprofile";



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
  const avatarUrl: string | StaticImageData = userDetails?.profile_image || avatar;
  console.log("avatarUrl:", avatarUrl);

  const handleUpdateProfile = async (updatedData: Partial<UserDetails>) => {
    // Implement your API call to update the user profile here
    console.log('Updating user profile with:', updatedData);
    // After successful update, you might want to refresh the userDetails
    // For now, we'll just close the modal
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col p-4 rounded-lg">
        <div className="relative w-[120px] h-[120px] rounded-full mx-auto mb-4 overflow-hidden">
          <Image
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
