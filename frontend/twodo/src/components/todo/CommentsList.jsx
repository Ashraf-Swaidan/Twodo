import React, { useState } from "react";
import { RiQuillPenLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosAddCircle, IoIosSend } from "react-icons/io";
import { Avatar } from "@mui/material";
import { ImAttachment } from "react-icons/im";

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
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = React.useRef(null); // Create a ref for the file input

  const handleFileIconClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleAddComment = async () => {
    if (newComment.trim() || attachments.length > 0) {
      try {
        const updatedTodo = await addComment(
          todo._id,
          { text: newComment },
          attachments
        );
        setComments(updatedTodo.comments);
        setNewComment("");
        setAttachments([]);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleEditComment = async (todoId, commentId, text) => {
    try {
      await editComment(todoId, commentId, { text });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, text } : comment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (todoId, commentId) => {
    try {
      await deleteComment(todoId, commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderAttachments = (attachments) => {
    return attachments.map((file, index) => {
      const fileUrl = `http://localhost:5000/${file.fileUrl || file.path}`;
      const fileType = file.mimetype?.split("/")[0];

      if (fileType === "image") {
        return (
          <img
            key={index}
            src={fileUrl}
            alt="attachment"
            className="max-w-xs my-2"
          />
        );
      } else {
        return (
          <a
            key={index}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 underline"
          >
            {file.fileName || file.name}
          </a>
        );
      }
    });
  };

  return (
    <>
      <hr className="mt-4" />
      {comments.length > 0 && (
        <div className="ml-8 max-h-96 overflow-auto">
          <span className="text-sm sm:text-md">Comments:</span>
          <ul className="mt-2 space-y-3">
            {comments.map((comment, index) => (
              <li key={comment._id} className="flex items-start border-b pb-2 mb-2">
                <Avatar
                  src={`http://localhost:5000${userDetails[index]?.avatar}`}
                  alt={`${userDetails[index]?.username}'s avatar`}
                  className="mr-2"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">
                      {userDetails[index]?.username}
                    </span>
                    <div className="flex items-center">
                      {user.id === comment.user && (
                        <div className="flex items-center mr-2">
                          <button
                            onClick={() =>
                              setEditingComment({
                                id: comment._id,
                                text: comment.text,
                              })
                            }
                            className="text-gray-600 hover:text-blue-500"
                          >
                            <RiQuillPenLine />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteComment(todo._id, comment._id)
                            }
                            className="text-gray-600 hover:text-red-600"
                          >
                            <MdOutlineDeleteOutline />
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
                          setEditingComment(null);
                        }
                      }}
                      className="border-1 text-gray-500 text-sm mt-1 w-full p-1"
                    />
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm mt-1">
                        {comment.text}
                      </p>
                      {comment.attachments && renderAttachments(comment.attachments)}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {userRole !== "viewer" && (
        <div className="ml-8 mt-4 flex items-center">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden" // Hide the input
            ref={fileInputRef} // Attach the ref
          />
          <button className="mr-2" onClick={handleFileIconClick}>
            <ImAttachment /> {/* Your attachment icon */}
          </button>

          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={handleCommentChange}
            className="text-sm sm:text-lg border-gray-300 rounded p-2 mr-2 flex-grow"
          />
          <button
            className="text-xs sm:text-lg hover:text-accent mr-2"
            onClick={handleAddComment}
          >
            <IoIosSend />
          </button>

          {/* Display names of uploaded files */}
          {attachments.length > 0 && (
            <div className="ml-2 text-sm text-gray-500">
              {Array.from(attachments).map((file) => (
                <span key={file.name} className="mr-2">
                  {file.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CommentsList;
