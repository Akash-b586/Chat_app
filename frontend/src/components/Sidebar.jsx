import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendsStore } from "../store/useFriendsStore";
import { useLayoutStore } from "../store/useLayoutStore";
import { Conversation } from "./Conversation";
import { MessageSquareMore, Search } from "lucide-react";
import classNames from "classnames";
import { CreateConversationModal } from "./CreateConversationModal";
export const Sidebar = () => {
  const onlineUsers = useFriendsStore((state) => state.onlineUsers);

  const isChatInfoOpen = useLayoutStore((state) => state.isChatInfoOpen);

  const modalRef = useRef(null);

  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );
  const getConversations = useChatStore((state) => state.getConversations);
  const conversations = useChatStore((state) => state.conversations);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  useEffect(() => {
    getConversations();
  }, [getConversations]);

  const sidebarClasses = classNames(
    "h-full w-full max-w-md bg-base-200 flex flex-col rounded-lg",
    {
      "hidden lg:flex": isChatInfoOpen || selectedConversation,
    }
  );

  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter((conversation) => {
    return conversation.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());
  });

  return (
    <aside className={sidebarClasses}>
      <div className="border-b border-base-300 p-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">Chats</p>
          <div className="tooltip tooltip-bottom" data-tip="Create new chat">
            <button
              className="btn btn-sm btn-ghost rounded-full"
              onClick={() => modalRef.current.showModal()}
            >
              <MessageSquareMore className="size-5" />
            </button>
          </div>
        </div>

        <label className="input input-bordered flex items-center gap-2 mt-3 rounded-full">
          <Search className="size-5" />
          <input
            type="text"
            className="grow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
          />
        </label>

        <div className="flex mt-3 items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length} online)
          </span>
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto h-screen">
        {filteredConversations.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))}
      </div>
      <CreateConversationModal modalRef={modalRef} />
    </aside>
  );
};
