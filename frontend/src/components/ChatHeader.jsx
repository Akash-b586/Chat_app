import { Ellipsis, MoveLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useFriendsStore } from "../store/useFriendsStore";
import { useLayoutStore } from "../store/useLayoutStore";
import classNames from "classnames";

export const ChatHeader = () => {
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );
  const setSelectedConversation = useChatStore(
    (state) => state.setSelectedConversation
  );
  const onlineUsers = useFriendsStore((state) => state.onlineUsers);
  const toggleChatInfo = useLayoutStore((state) => state.toggleChatInfo);
  const isChatInfoOpen = useLayoutStore((state) => state.isChatInfoOpen);
  const isGroup = selectedConversation.type === "group";
  const selectedUser = !isGroup && selectedConversation?.participants[0];

  const { avatar, name } = selectedConversation;

  const btnClasses = classNames("btn btn-circle", {
    "bg-indigo-800": isChatInfoOpen,
  });

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-3">
          <button
            className="btn btn-ghost btn-circle  lg:hidden"
            onClick={() => setSelectedConversation(null)}
          >
            <MoveLeft className="size-6" />
          </button>
          <button className="btn flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative ">
                <img src={avatar || "/avatar.png"} alt={name} />
              </div>
            </div>

            {/* User info */}
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Active Now" : ""}
              </p>
            </div>
          </button>
        </div>

        {/* Chat info button */}
        <button className={btnClasses} onClick={() => toggleChatInfo()}>
          <Ellipsis />
        </button>
      </div>
    </div>
  );
};
