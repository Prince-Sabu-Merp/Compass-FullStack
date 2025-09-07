import React from "react";

function ProfileCard({ user }) {
  const { name, title, address, phone, email, profileImageUrl, profileLink } =
    user;

  return (
    <div className="flex items-center h-screen w-full justify-center">
      <div className="max-w-xs">
        <div className="bg-white shadow-xl rounded-lg py-3">
          <div className="photo-wrapper p-2">
            <img
              className="w-32 h-32 rounded-full mx-auto"
              src={profileImageUrl}
              alt={name}
            />
          </div>
          <div className="p-2">
            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">
              {name}
            </h3>
            <div className="text-center text-gray-400 text-xs font-semibold">
              <p>{title}</p>
            </div>
            <dl className="text-xs my-3">
              <div className="flex px-2 py-2">
                <dt className="text-gray-500 font-semibold w-1/3">Address</dt>
                <dd className="w-2/3">{address}</dd>
              </div>
              <div className="flex px-2 py-2">
                <dt className="text-gray-500 font-semibold w-1/3">Phone</dt>
                <dd className="w-2/3">{phone}</dd>
              </div>
              <div className="flex px-2 py-2">
                <dt className="text-gray-500 font-semibold w-1/3">Email</dt>
                <dd className="w-2/3">{email}</dd>
              </div>
            </dl>
            <div className="text-center my-3">
              <a
                className="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium"
                href={profileLink}
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
