import React, { useState } from "react";
import { RiQuillPenLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { Avatar } from "@mui/material";

const CommentsList = ({
  todo,
  comments,
  userDetails,
  user,
  newComment,
  setNewComment,
  setComments,
  addComment,
  editComment,
  deleteComment,
  userRole,
}) => {
  const [editingComment, setEditingComment] = useState(null);
  console.log(editingComment);
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const updatedTodo = await addComment(todo._id, { text: newComment }); // Assuming addComment takes todoId and comment data
        setComments(updatedTodo.comments); // Update comments state with the new list
        setNewComment(""); // Clear the input field after adding
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleEditComment = async (todoId, commentId, text) => {
    try {
      console.log("editing comment");
      await editComment(todoId, commentId, { text });

      // Update local state for comments
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, text } : comment
        )
      );

      // Clear the editing comment state
      setEditingComment(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (todoId, commentId) => {
    try {
      await deleteComment(todoId, commentId); // Call your deleteComment API
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      ); // Update local state
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Customize format as needed
  };

  return (
    <>
      <hr className="mt-4" />
      {comments.length > 0 && (
        <div className="ml-8 max-h-48 overflow-auto">
          <span className="text-sm sm:text-md">Comments:</span>
          <ul className="mt-2">
            {comments.map((comment, index) => (
              <li key={comment._id} className="flex items-center mb-2">
                <Avatar
                  src={`http://localhost:5000${userDetails[index]?.avatar}`}
                  alt={`${userDetails[index]?.username}'s avatar`}
                  className="mr-2"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {userDetails[index]?.username}
                    </span>
                    <div className="flex items-center">
                      {user.id === comment.user && ( // Check if the user is the owner of the comment
                        <div className="flex items-center mr-2">
                          <button
                            onClick={() =>
                              setEditingComment({
                                id: comment._id,
                                text: comment.text,
                              })
                            }
                          >
                            <RiQuillPenLine /> {/* Edit Icon */}
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteComment(todo._id, comment._id)
                            }
                          >
                            <MdOutlineDeleteOutline className="text-red-600" />
                          </button>
                        </div>
                      )}

                      <span className="text-gray-500 text-xs">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {editingComment?.id === comment._id ? (
                    <input
                      type="text"
                      value={editingComment.text}
                      onChange={(e) =>
                        setEditingComment({
                          ...editingComment,
                          text: e.target.value,
                        })
                      }
                      onBlur={() => {
                        if (editingComment.text.trim()) {
                          handleEditComment(
                            todo._id,
                            comment._id,
                            editingComment.text
                          );
                        } else {
                          setEditingComment(null); // Clear if input is empty
                        }
                      }}
                      className="border-1 text-gray-500 text-xs sm:text-md"
                    />
                  ) : (
                    <p className="text-gray-500 text-xs sm:text-md">
                      {comment.text}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {userRole !== "viewer" && (
        <div className="ml-8 mt-2 flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={handleCommentChange}
            className="text-xs sm:text-lg border-0 outline-none rounded p-1"
          />
          <button
            className="text-xs sm:text-lg hover:text-accent ml-2"
            onClick={handleAddComment}
          >
            <IoIosAddCircle />
          </button>
        </div>
      )}
    </>
  );
};

export default CommentsList;
