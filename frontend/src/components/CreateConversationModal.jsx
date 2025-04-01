import { useCallback, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { CircleX } from "lucide-react";

export const CreateConversationModal = ({ modalRef }) => {
  const [modalState, setModalState] = useState({
    searchQuery: "",
    selectedUsers: [],
  });
  const { searchQuery, selectedUsers } = modalState;

  const authUser = useAuthStore((state) => state.authUser);

  const createConversation = useChatStore((state) => state.createConversation);

  const filteredFriends = useMemo(
    () =>
      authUser.friends.filter(
        (friend) =>
          friend.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !selectedUsers.some((u) => u._id === friend._id)
      ),
    [authUser.friends, searchQuery, selectedUsers]
  );

  const handleUserSelect = useCallback((friend) => {
    setModalState((prev) => ({
      ...prev,
      selectedUsers: [...prev.selectedUsers, friend],
      searchQuery: "",
    }));
  }, []);

  const removeUser = (friendId) => {
    setModalState((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter((user) => user._id !== friendId),
    }));
  };

  const handleCreateChat = useCallback(async () => {
    const participants = selectedUsers.map((user) => user._id);
    const name =
      selectedUsers.length > 1
        ? selectedUsers.map((user) => user.username).join(", ")
        : selectedUsers[0].username;

    const conversation = {
      participants,
      name,
    };

    await createConversation(conversation);

    setModalState({ searchQuery: "", selectedUsers: [] });
    modalRef.current.close();
  }, [createConversation, selectedUsers, modalRef]);

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <p className="mb-2">To:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="badge badge-primary gap-2 p-3 badge-lg"
            >
              <span>{user.username}</span>
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => removeUser(user._id)}
              >
                <CircleX className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <input
          value={searchQuery}
          onChange={(e) =>
            setModalState((prev) => ({
              ...prev,
              searchQuery: e.target.value,
            }))
          }
          placeholder="Search friends..."
          className="mt-1 input input-bordered w-full"
        />

        <div className="flex flex-col gap-2 mt-4 max-h-48 overflow-y-auto overflow-x-hidden">
          {filteredFriends.map((friend) => (
            <button
              className="btn btn-ghost justify-start"
              key={friend._id}
              onClick={() => handleUserSelect(friend)}
            >
              <img
                className="w-8 h-8 rounded-full mr-2"
                src={friend.profilePicture}
                alt={friend.username}
              />
              <span className="text-sm">{friend.username}</span>
            </button>
          ))}
        </div>

        <div className="modal-action mt-0">
          <form method="dialog">
            <button className="btn">Cancel</button>
          </form>
          <button
            className="btn btn-primary"
            disabled={selectedUsers.length === 0}
            onClick={handleCreateChat}
          >
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
};
