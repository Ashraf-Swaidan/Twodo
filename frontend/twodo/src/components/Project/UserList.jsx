import React from 'react';
import { Image } from '@nextui-org/react';
const UserList = ({  users }) => {
  

  return (
    <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-white shadow-lg ">
      <h3 className="text-lg font-semibold text-gray-800">Project Collaborators</h3>
      <ul className="divide-y divide-gray-200 mt-2">
        {users.map((user) => (
          <li key={user._id} className="flex items-center justify-between py-2 hover:bg-gray-100 transition duration-150 ease-in-out">
            <div className="flex items-center space-x-2">
              <Image
                src={`http://localhost:5000${user.avatar}`}
                alt={user.username}
                width={25}
                height={25}
              />
              <span className="font-medium text-gray-900">{user.username}</span>
            </div>
            <span className="text-sm text-gray-500">{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
