import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { formatError } from "../utils/formatError.js";
import { useAuthStore } from "./useAuthStore.js";

import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  selectedConversation: null,
  selectedUser: null, // Selected user in the chat
  conversations: [],
  messages: [],
  loading: false,
  error: false,
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  getMessages: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(
        `/messages/${get().selectedUser._id}`
      );
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
  getConversations: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/conversations");
      set({ conversations: res.data.conversations });
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
  createConversation: async (details) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/conversations", details);
      const conversation = res.data.conversation;
      const myConversations = get().conversations;
      if (!myConversations.some((c) => c._id === conversation._id)) {
        set({ conversations: [conversation, ...myConversations] });
      }
      set({ selectedConversation: conversation });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
  deleteConversation: async (conversationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.delete(
        `/conversations/${conversationId}`
      );
      set({
        conversations: get().conversations.filter(
          (conversation) => conversation._id !== conversationId
        ),
      });

      if (get().selectedConversation?._id === conversationId) {
        set({ selectedConversation: null });
      }

      toast.success(res.data.message);
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
  leaveGroup: async (conversationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.delete(
        `/conversations/${conversationId}/leave`
      );
      set({
        conversations: get().conversations.filter(
          (conversation) => conversation._id !== conversationId
        ),
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
  muteConversation: async (conversationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(
        `/conversations/${conversationId}/mute`
      );
      set({
        conversations: get().conversations.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                mutedBy: [
                  ...(conversation.mutedBy || []),
                  useAuthStore.getState().authUser._id,
                ],
              }
            : conversation
        ),
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
  unmuteConversation: async (conversationId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(
        `/conversations/${conversationId}/unmute`
      );
      set({
        conversations: get().conversations.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                mutedBy: conversation.mutedBy.filter(
                  (id) => id !== useAuthStore.getState().authUser._id
                ),
              }
            : conversation
        ),
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set({ loading: false });
    }
  },
}));
