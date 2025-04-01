// import { useEffect } from "react";
import { useFriendsStore } from "../store/useFriendsStore";
import { Card } from "./Card";
export const User = ({ user }) => {
  const sentRequests = useFriendsStore((state) => state.sentRequests);
  const sendRequest = useFriendsStore((state) => state.sendRequest);
  const loadingId = useFriendsStore((state) => state.loading.id);
  const cancelRequest = useFriendsStore((state) => state.cancelRequest);
  const loading = useFriendsStore((state) => state.loading.action);

  const sentRequest = sentRequests.find(
    (request) => request.receiver._id === user._id
  );
  // Check if this specific user is loading
  const isLoading =
    loading && loadingId === (sentRequest ? sentRequest._id : user._id);

  const handleClick = async () => {
    if (sentRequest) {
      await cancelRequest(sentRequest._id);
    } else {
      await sendRequest(user._id);
    }
  };
  return (
    <Card connection={user}>
      <button
        className={`btn btn-sm text-xs ${
          sentRequest ? "btn-error hover:btn-error" : "btn-accent"
        } transition-colors`}
        disabled={isLoading}
        onClick={handleClick}
      >
        {isLoading
          ? "Loading..."
          : sentRequest
          ? "Cancel Request"
          : "Add Friend"}
      </button>
    </Card>
  );
};
