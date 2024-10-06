import React from "react";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import UserList from "./UserList";

const TodoFilters = ({
  userRole,
  searchTerm,
  handleSearchChange,
  showCompleted,
  toggleShowCompleted,
  isTagDropdownVisible,
  setIsTagDropdownVisible,
  selectedTags,
  setSelectedTags,
  availableTags,
  emailToInvite,
  setEmailToInvite,
  inviteCollaborator,
  isInviteDropdownVisible,
  setIsInviteDropdownVisible,
  projectId,
  project,
  isUserListVisible,
  toggleUserList,
  users,
  handleRemoveCollaborator,
  handleUpdateCollaboratorRole
}) => (
  <div className="flex flex-wrap items-center mb-6 sm:w-auto space-y-3 md:space-y-2">
    <div className="flex items-center w-full sm:w-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search todo..."
        className="p-2 px-4 mr-2 w-full sm:w-auto border rounded focus:ring-1 focus:outline-none focus:ring-zinc-400"
      />
      <FaSearch />
    </div>
    <label className="flex items-center ml-2 ">
      <Checkbox
        radius="full"
        isSelected={showCompleted}
        onChange={toggleShowCompleted}
        color="default"
        size="lg"
        css={{ margin: 0 }}
      />
      <span className="">Show Completed</span>
    </label>
    <div className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsTagDropdownVisible((prev) => !prev)}
        className="px-3 py-1 ml-2 text-accent border-1 rounded"
      >
        {isTagDropdownVisible ? "Hide Tags" : "Select Tags"}
      </button>
      {isTagDropdownVisible && (
        <div
          className="absolute z-10 p-4 mt-2 bg-white border border-gray-300 rounded shadow-lg w-full sm:w-64"
          style={{ minWidth: "200px" }}
        >
          <CheckboxGroup
            label="Filter by tags"
            value={selectedTags}
            onChange={setSelectedTags}
            orientation="horizontal"
          >
            {availableTags.map((tag) => (
              <Checkbox color="danger" key={tag} value={tag}>
                {tag}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      )}
      
    </div>


      <div>

      {(userRole === 'Owner' || userRole === 'editor') && 
        <button
        onClick={() => setIsInviteDropdownVisible((prev) => !prev)}
        className=" px-3 py-1 ml-2 text-accent border-1 rounded"
      >
        Invite your friend
      </button>
    }
      

      {isInviteDropdownVisible && (
        <div className="absolute mt-2 z-20 p-4 bg-white border border-gray-300 rounded shadow-lg w-74">
          <div className="flex items-center space-x-2">
            <input
              type="email"
              value={emailToInvite}
              onChange={(e) => setEmailToInvite(e.target.value)}
              placeholder="Enter email"
              className="w-full p-2 rounded focus:outline-none"
            />

            <button
              onClick={() => {
                inviteCollaborator(projectId, emailToInvite);
                setEmailToInvite(""); // Optionally, clear the input after inviting
                setIsInviteDropdownVisible(false); // Hide the dropdown after invite
              }}
              className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Invite
            </button>
          </div>
        </div>
      )}
       </div>

            <div>
        <button
        onClick={toggleUserList}
        className=" px-3 py-1 ml-2 text-accent border-1 rounded"
      >
        {isUserListVisible ? "Hide Collaborators" : "Show Collaborators"}
      </button>

      {isUserListVisible && project && ( // Render UserList conditionally
        <div className="absolute right-50 z-50"> {/* Adjust styles as needed */}
          <UserList
            users={users}
            userRole={userRole}
            handleRemoveCollaborator={handleRemoveCollaborator}
            handleUpdateCollaboratorRole={handleUpdateCollaboratorRole}
          />
        </div>
      )}
        </div>

  </div>
);

export default TodoFilters;
