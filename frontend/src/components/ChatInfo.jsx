import {
  MoveLeft,
  Lock,
  Search,
  UserRound,
  Pin,
  Bell,
  Users,
  CircleX,
  Ellipsis,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useLayoutStore } from "../store/useLayoutStore";
import { useState } from "react";

export const ChatInfo = () => {
  const toggleChatInfo = useLayoutStore((state) => state.toggleChatInfo);

  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );

  const { avatar, name, type, participants } = selectedConversation;

  const [image, setImage] = useState(avatar);

  return (
    <div className="w-full lg:max-w-96 bg-base-200 flex flex-col rounded-lg m-auto overflow-y-auto h-full">
      {/* Header */}
      <div className="relative p-4">
        <button
          className="btn btn-ghost btn-circle absolute left-5 top-3 lg:hidden"
          onClick={() => toggleChatInfo()}
        >
          <MoveLeft className="size-6" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <img
          src={avatar || image || "/avatar.png"}
          alt={name}
          className="size-24 rounded-full overflow-hidden object-cover"
        />
        {type === "direct" ? (
          <>
            <Link
              className="mt-4 text-lg font-bold hover:underline"
              to={`/profile/${participants[0]._id}`}
            >
              {name}
            </Link>
            <div className="mt-2 text-sm text-base-content/70 flex items-center gap-1.5">
              <Lock className="size-4" />
              <span>End-to-end encrypted</span>
            </div>
          </>
        ) : (
          <h1 className="mt-4 text-lg font-bold">{name}</h1>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 my-4">
        <div className="flex flex-col gap-1 items-center justify-center">
          <button className="btn btn-md btn-outline">
            <Bell className="size-5" />
          </button>
          <span className="text-sm">Mute</span>
        </div>
        <div className="flex flex-col gap-1 items-center justify-center">
          <button className="btn btn-md btn-outline">
            <Search className="size-5" />
          </button>
          <span className="text-sm">Search</span>
        </div>
        {type === "direct" ? (
          <Link
            to={`/profile/${participants[0].user._id}`}
            className="flex flex-col gap-1 items-center justify-center"
          >
            <button className="btn btn-md btn-outline">
              <UserRound className="size-5" />
            </button>
            <span className="text-sm">Profile</span>
          </Link>
        ) : (
          <div className="flex flex-col gap-1 items-center justify-center">
            <button className="btn btn-md btn-outline">
              <CircleX className="size-5" />
            </button>

            <span className="text-sm">Leave</span>
          </div>
        )}
      </div>

      <button className="btn btn-ghost justify-start w-full gap-3">
        <Pin className="size-5" />
        <span>View pinned messages</span>
      </button>

      {type === "group" && (
        <div
          tabIndex={0}
          className="collapse collapse-arrow rounded-lg btn-ghost group h-auto"
        >
          <input type="checkbox" />
          <div className="collapse-title font-semibold flex items-center gap-3">
            <Users className="size-5" />
            <span>Chat Members</span>
          </div>

          <div className="collapse-content">
            {participants.map(({ user, addedBy }) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-1"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="size-9 rounded-full overflow-hidden object-cover"
                  />
                  <div className="flex flex-col">
                    <span>{user.username}</span>
                    <span className="text-sm text-base-content/70">
                      {user._id === selectedConversation.createdBy
                        ? "Group Owner"
                        : `Added by ${addedBy.username}`}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-ghost btn-sm dropdown dropdown-end tooltip tooltip-left"
                  data-tip="Member options"
                >
                  <Ellipsis className="size-5" />
                  <ul className="menu dropdown-content bg-base-200 rounded-box z-[1] w-72">
                    <li>
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Item 2</a>
                    </li>
                  </ul>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
