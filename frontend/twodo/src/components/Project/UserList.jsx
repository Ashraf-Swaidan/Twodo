import React from 'react';
import { Avatar } from "@mui/material";

const UserList = ({ users, userRole, handleRemoveCollaborator, handleUpdateCollaboratorRole }) => {
  return (
    <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800">Project Collaborators</h3>
      <ul className="divide-y divide-gray-200 mt-2">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between py-2 transition duration-150 ease-in-out"
          >
            <div className="flex items-center space-x-3 mr-7">
              <Avatar
                src={user.avatar}
                alt={user.username}
              />
              <span className="font-medium text-gray-900">{user.username}</span>
            </div>

            {/* Conditional rendering for owner to display 'Owner' label or role dropdown */}
            {user.role === 'Owner' ? (
              <span className="text-sm font-bold text-gray-500">Owner</span>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Role Dropdown for non-owners */}
                {userRole === 'Owner' && (
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateCollaboratorRole(user._id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                )}

                {/* Remove Collaborator Button */}
                {userRole === 'Owner' && (
                  <button
                    onClick={() => handleRemoveCollaborator(user._id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
