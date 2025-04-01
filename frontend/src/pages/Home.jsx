import { useChatStore } from "../store/useChatStore";
import { useLayoutStore } from "../store/useLayoutStore";
import { Sidebar } from "../components/Sidebar";
import { ChatContainer } from "../components/ChatContainer";
import { NoChat } from "../components/NoChat";
import { ChatInfo } from "../components/ChatInfo";

const Home = () => {
  const selectedConversation = useChatStore(
    (state) => state.selectedConversation
  );
  const isChatInfoOpen = useLayoutStore((state) => state.isChatInfoOpen);

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center pt-24 px-5">
        <div className="w-full max-w-8xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden gap-4">
            <Sidebar />
            {selectedConversation ? <ChatContainer /> : <NoChat />}

            {/* Chat Info */}
            {isChatInfoOpen && <ChatInfo />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
