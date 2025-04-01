import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendsStore } from "../store/useFriendsStore";
import { UsersList } from "../components/UsersList";
import { Request } from "../components/Request";
import { Friend } from "../components/Friend";
import { User } from "../components/User";
import { TabPanel } from "../components/TabPanel";

const Friends = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const getRequests = useFriendsStore((state) => state.getRequests);
  const requests = useFriendsStore((state) => state.requests);
  const getUsers = useFriendsStore((state) => state.getUsers);
  const users = useFriendsStore((state) => state.users);
  const getSentRequests = useFriendsStore((state) => state.getSentRequests);

  useEffect(() => {
    getRequests();
    getUsers();
    getSentRequests();
  }, [getRequests, getUsers, getSentRequests]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl p-5">
          <div role="tablist" className="tabs tabs-lifted">
            <TabPanel label="Friends">
              <UsersList>
                {authUser.friends.length === 0 && (
                  <h2 className=" text-lg font-semibold">
                    You got no friends.
                  </h2>
                )}
                {authUser.friends.map((friend) => (
                  <Friend key={friend._id} friend={friend} />
                ))}
              </UsersList>
            </TabPanel>

            <TabPanel label="Requests">
              <UsersList>
                {requests.length === 0 && (
                  <h2 className="text-lg font-semibold">
                    You got no requests.
                  </h2>
                )}
                {requests.map((request) => (
                  <Request key={request._id} request={request} />
                ))}
              </UsersList>
            </TabPanel>

            <TabPanel label="Suggestions">
              <UsersList>
                {users.length === 0 && (
                  <h2 className="text-lg font-semibold">
                    We couldn&apos;t find any user.
                  </h2>
                )}
                {users.map((user) => (
                  <User key={user._id} user={user} />
                ))}
              </UsersList>
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
