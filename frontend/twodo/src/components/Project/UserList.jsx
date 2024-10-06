import React from 'react';
import { Image } from '@nextui-org/react';

const UserList = ({ users, userRole, handleRemoveCollaborator, handleUpdateCollaboratorRole }) => {
  return (
    <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800">Project Collaborators</h3>
      <ul className="divide-y divide-gray-200 mt-2">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between py-2 hover:bg-gray-100 transition duration-150 ease-in-out"
          >
            <div className="flex items-center space-x-3 mr-7">
              <Image
                src={`http://localhost:5000${user.avatar}`}
                alt={user.username}
                width={25}
                height={25}
              />
              <span className="font-medium text-gray-900">{user.username}</span>
            </div>

            {/* Conditional rendering for owner to edit or remove */}
            {userRole === 'Owner' ? (
              <div className="flex items-center space-x-4">
                {/* Role Dropdown */}
                <select
                  value={user.role}
                  onChange={(e) => handleUpdateCollaboratorRole(user._id, e.target.value)}
                  disabled={user.role === 'Owner'} // Disable dropdown if the user is an Owner
                  className={`border border-gray-300 rounded-md px-2 py-1 text-sm ${
                    user.role === 'Owner' ? 'bg-gray-200 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="Owner">Owner</option>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>

                {/* Remove Collaborator Button */}
                {user.role !== 'Owner' && (
                  <button
                    onClick={() => handleRemoveCollaborator(user._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500">{user.role}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
