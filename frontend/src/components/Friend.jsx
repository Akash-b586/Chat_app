import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useFriendsStore } from "../store/useFriendsStore";
import { useRef } from "react";
import { Card } from "./Card";
export const Friend = ({ friend }) => {
  const navigate = useNavigate();

  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const loading = useFriendsStore((state) => state.loading.action);
  const removeFriend = useFriendsStore((state) => state.removeFriend);

  const modalRef = useRef(null);

  const sendMessage = () => {
    setSelectedUser(friend);
    navigate("/");
  };

  const remFriend = async (userId) => {
    modalRef.current.close();
    await removeFriend(userId);
  };

  return (
    <Card connection={friend}>
      <button
        className="btn btn-sm btn-secondary text-xs"
        disabled={loading}
        onClick={() => modalRef.current.showModal()}
      >
        Remove
      </button>
      <button className="btn btn-sm btn-primary text-xs" onClick={sendMessage}>
        Send Message
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            This action cannot be undone. Click the button below to cancel.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button
              className="btn btn-error"
              onClick={() => remFriend(friend._id)}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </Card>
  );
};
