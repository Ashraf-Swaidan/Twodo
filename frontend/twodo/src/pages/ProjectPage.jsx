import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTodos } from "../hooks/useTodos";
import CreateTodoModal from "../components/todoModals/CreateTodoModal";
import { useProjectsContext } from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import ProjectHeader from "../components/project/ProjectHeader";
import TodoFilters from "../components/project/TodoFilters";
import TodoList from "../components/project/TodoList";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@nextui-org/react";
import { CiSettings } from "react-icons/ci";


function ProjectPage() {
  const { projectId } = useParams();
  const { projects, updateProject, inviteCollaborator, deleteProject, removeCollaborator, updateCollaboratorRole } = useProjectsContext();
  const { addTodo, updateTodo, deleteTodo, fetchTodosByProject } = useTodos();
  const { user, getUserDetails } = useAuth();
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("viewer");
  const [todos, setTodos] = useState([]);
  console.log(todos);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isTagDropdownVisible, setIsTagDropdownVisible] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false); 
  const [isEditingDescription, setIsEditingDescription] = useState(false); 
  const [newTitle, setNewTitle] = useState(""); 
  const [newDescription, setNewDescription] = useState(""); 
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isInviteDropdownVisible, setIsInviteDropdownVisible] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState("");

  const project = projects.find((project) => project._id === projectId);

  const [dueDate, setDueDate] = useState(null);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); 
  const navigate = useNavigate(); 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(project)

  useEffect(() => {
    const getTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodosByProject(projectId);
        setTodos(data);
        setFilteredTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTodos();
  }, [projectId]);

  useEffect(() => {
    filterAndSortTodos();
  }, [todos, searchTerm, showCompleted, projectId, selectedTags]);

  useEffect(() => {
    if (todos.length) {
      const tags = getUniqueTags(todos);
      setAvailableTags(tags);
    }
  }, [todos, projectId]);

  useEffect(() => {
    console.log('function called ')
    if (project && user) {
      console.log('entered the condition')
      console.log(user)
      console.log(project.owner)
      // Step 1: Check if the current user is the owner of the project
      if (user.id === project.owner) {
        console.log('set user as owner')
        setUserRole("Owner");
      } else {
        // Step 2: Map through collaborators to check if the user is a collaborator and assign their role
        console.log('entered sub else')
        console.log('set user as his role')
        const matchingCollaborator = project.collaborators.find(collaborator => collaborator.user === user.id);
        
        if (matchingCollaborator) {
          console.log(`set user as his role: ${matchingCollaborator.role}`)
          setUserRole(matchingCollaborator.role);
        } else {
          console.log('entered the else')
          setUserRole("viewer");  // Default role
        }
      }
    }
}, [project, user]);

useEffect(() => {
  const fetchCollaboratorDetails = async () => {
    if (project) {
      try {
        // Step 1: Fetch collaborator details
        const userPromises = project.collaborators.map(async (collaborator) => {
          const userDetails = await getUserDetails(collaborator.user);
          return {
            ...userDetails,
            role: collaborator.role,
          };
        });

        // Step 2: Fetch owner details
        const ownerDetails = await getUserDetails(project.owner);

        // Step 3: Combine owner and collaborators into one array
        const allUsers = [{ ...ownerDetails, role: 'Owner' }, ...await Promise.all(userPromises)];

        // Step 4: Set the users state
        setUsers(allUsers);

      } catch (error) {
        console.error('Failed to fetch user details', error);
      }
    }
  };

  fetchCollaboratorDetails();
}, [project, getUserDetails]);



  const filterAndSortTodos = () => {
    const filtered = todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCompletion = showCompleted || !todo.completed;

      // Check if any selected tag is present in the todo's tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          (todo.tags || []).map((t) => t.toLowerCase()).includes(tag)
        );

      return matchesSearch && matchesCompletion && matchesTags;
    });

    setFilteredTodos(filtered);
  };

  const toggleCompletion = async (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    const updatedTodo = await updateTodo(id, {
      completed: !todos.find((todo) => todo._id === id).completed,
    });
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  };

  const handleTaskSelection = (todo) => {
    setSelectedTodo(todo);
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
      navigate("/todos"); // Redirect to the /todos route after deletion
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      closeWarningModal();
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleCreateTodo = async (todoData) => {
    const newTodo = await addTodo(todoData);
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const openWarningModal = () => {
    setIsWarningModalOpen(true);
  };

  const closeWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleStartProject = async () => {
    if (project.status === "pending") {
      await updateProject(projectId, { status: "in-progress" });
    }
  };

  const handleCheckboxChange = async () => {
    if (project.status === "in-progress") {
      await updateProject(projectId, { status: "completed" });
    } else if (project.status === "completed") {
      await updateProject(projectId, { status: "in-progress" });
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setNewTitle(project.name);
  };

  const handleDescriptionEdit = () => {
    setIsEditingDescription(true);
    setNewDescription(project.description);
  };

  const handleTitleSave = async () => {
    await updateProject(projectId, { name: newTitle });
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = async () => {
    await updateProject(projectId, { description: newDescription });
    setIsEditingDescription(false);
  };

  const groupTodosByDate = (todos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);

    const groupedTodos = {
      Overdue: [],
      Today: [],
      Tomorrow: [],
      "This Week": [],
      Later: [],
    };

    todos.forEach((todo) => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        groupedTodos.Overdue.push(todo);
      } else if (dueDate.toDateString() === today.toDateString()) {
        groupedTodos.Today.push(todo);
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        groupedTodos.Tomorrow.push(todo);
      } else if (dueDate > today && dueDate <= nextWeek) {
        groupedTodos["This Week"].push(todo);
      } else {
        groupedTodos.Later.push(todo);
      }
    });

    return groupedTodos;
  };

  const calculateProgress = () => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter((todo) => todo.completed).length;
    return totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100; // Returns a percentage
  };

  const handleDueDateChange = (selectedDate) => {
    setDueDate(selectedDate);
  };

  const handleSaveDueDate = async () => {
    if (dueDate) {
      // Convert the {day, month, year} to a JavaScript Date object
      const formattedDueDate = new Date(
        dueDate.year,
        dueDate.month - 1,
        dueDate.day
      );

      await updateProject(projectId, {
        dueDate: formattedDueDate.toISOString(),
      });

      setIsRescheduling(false);
    }
  };

  const getUniqueTags = (todos) => {
    const allTags = todos.flatMap((todo) => todo.tags || []);
    const uniqueTags = [...new Set(allTags.map((tag) => tag.toLowerCase()))];
    return uniqueTags;
  };

  const groupedTodos = groupTodosByDate(filteredTodos);
  const progress = calculateProgress();

  const toggleUserList = () => {
    setIsUserListVisible((prev) => !prev); // Toggle visibility
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      await removeCollaborator(projectId, collaboratorId);
      // Update the local users state by filtering out the removed collaborator
      setUsers((prevUsers) => prevUsers.filter(user => user._id !== collaboratorId));
      console.log("Collaborator removed successfully");
    } catch (error) {
      console.error("Error removing collaborator:", error.message);
    }
  };
  
  
  const handleUpdateCollaboratorRole = async (collaboratorId, newRole) => {
    try {
      await updateCollaboratorRole(projectId, collaboratorId, newRole);
      
      // Update the local users state by modifying the role of the collaborator
      setUsers((prevUsers) =>
        prevUsers.map(user =>
          user._id === collaboratorId ? { ...user, role: newRole } : user
        )
      );
      
      console.log("Collaborator role updated successfully");
    } catch (error) {
      console.error("Error updating collaborator role:", error.message);
    }
  };
  

  return (
    <>
    <div className="absolute top-5 right-5">
        <button
          className="text-gray-600 hover:text-black"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <CiSettings size={24}/>
        </button>

        {isSettingsOpen && (
          <div className="absolute right-0 w-48 bg-white shadow-md rounded border-1 z-10">
            <ul>
              <li>
                <button
                  disabled={userRole !== 'Owner' }
                  onClick={ userRole === 'Owner' ? onOpen : undefined} // Open the modal when "Delete Project" is clicked
                  className={`block px-4 py-2 hover:bg-neutral-50 w-full text-left ${userRole === 'Owner' ? 'text-red-600' : 'text-gray-300'}`}
                >
                  Delete Project
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>


    <div className="p-6 w-full lg:w-2/3 md:w-full ">
      <ProjectHeader
        userRole={userRole}
        project={project}
        handleStartProject={handleStartProject}
        handleCheckboxChange={handleCheckboxChange}
        handleTitleEdit={handleTitleEdit}
        handleDescriptionSave={handleDescriptionSave}
        handleDescriptionEdit={handleDescriptionEdit}
        handleTitleSave={handleTitleSave}
        isEditingTitle={isEditingTitle}
        isEditingDescription={isEditingDescription}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        isRescheduling={isRescheduling}
        setIsRescheduling={setIsRescheduling}
        dueDate={dueDate}
        handleDueDateChange={handleDueDateChange}
        onSaveDueDate={handleSaveDueDate}
        emailToInvite={emailToInvite}
        setEmailToInvite={setEmailToInvite}
        inviteCollaborator={inviteCollaborator}
        isInviteDropdownVisible={isInviteDropdownVisible}
        setIsInviteDropdownVisible={setIsInviteDropdownVisible}
        progress={progress}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        handleDeleteProject={handleDeleteProject}
      />
      

      <TodoFilters
        userRole={userRole}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        showCompleted={showCompleted}
        toggleShowCompleted={toggleShowCompleted}
        isTagDropdownVisible={isTagDropdownVisible}
        setIsTagDropdownVisible={setIsTagDropdownVisible}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        availableTags={availableTags}
        emailToInvite={emailToInvite}
        setEmailToInvite={setEmailToInvite}
        inviteCollaborator={inviteCollaborator}
        isInviteDropdownVisible={isInviteDropdownVisible}
        setIsInviteDropdownVisible={setIsInviteDropdownVisible}
        projectId={projectId}
        project={project}
        isUserListVisible={isUserListVisible}
        setIsUserListVisible={setIsUserListVisible}
        toggleUserList={toggleUserList}
        users={users}
        handleRemoveCollaborator={handleRemoveCollaborator}
        handleUpdateCollaboratorRole={handleUpdateCollaboratorRole}
      />


      <TodoList
        userRole={userRole}
        loading={loading}
        groupedTodos={groupedTodos}
        toggleCompletion={toggleCompletion}
        handleTaskSelection={handleTaskSelection}
        openWarningModal={openWarningModal}
        setIsModalOpen={setIsModalOpen}
        setTodos={setTodos} // Pass the function here
        handleDelete={handleDelete}
      />
      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTodo}
      />

      <Dialog
        open={isWarningModalOpen}
        onClose={closeWarningModal}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogContent>
          <p>Are you sure you want to delete this todo?</p>
        </DialogContent>
        <DialogActions>
          <button
            onClick={closeWarningModal}
            className="px-2 py-1 text-white rounded bg-accent hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedTodo._id)}
            className="px-2 py-1 mr-2 text-white rounded bg-danger hover:bg-red-400"
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
        </>
  );
}

export default ProjectPage;
