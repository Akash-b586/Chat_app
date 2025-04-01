import { useFriendsStore } from "../store/useFriendsStore";
import { Card } from "./Card";
export const Request = ({ request }) => {
  const acceptRequest = useFriendsStore((state) => state.acceptRequest);
  const rejectRequest = useFriendsStore((state) => state.rejectRequest);
  const loading = useFriendsStore((state) => state.loading.action);

  // const isLoading = loadingId === user._id;

  return (
    <Card connection={request.sender}>
      <button
        className="btn btn-sm btn-accent text-xs"
        disabled={loading}
        onClick={async () => acceptRequest(request)}
      >
        Accept
      </button>
      <button
        className="btn btn-sm btn-error text-xs"
        disabled={loading}
        onClick={() => {
          rejectRequest(request._id);
        }}
      >
        Decline
      </button>
    </Card>
  );
};
