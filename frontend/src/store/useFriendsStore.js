import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { formatError } from "../utils/formatError.js";
import { useAuthStore } from "./useAuthStore.js";
import toast from "react-hot-toast";

export const useFriendsStore = create((set) => ({
  users: [],
  requests: [],
  sentRequests: [],
  loading: {
    users: false,
    requests: false,
    action: false,
    id: null,
  },
  error: {
    users: false,
    requests: false,
    action: false,
  },
  onlineUsers: [],
  getUsers: async () => {
    set((state) => ({ loading: { ...state.loading, users: true } }));
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data.users });
    } catch (error) {
      set((state) => ({ error: { ...state.error, users: true } }));
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set((state) => ({ loading: { ...state.loading, users: false } }));
    }
  },

  getRequests: async () => {
    set((state) => ({ loading: { ...state.loading, requests: true } }));
    try {
      const response = await axiosInstance.get("/friends/pending");
      set({ requests: response.data.requests });
    } catch (error) {
      set((state) => ({ error: { ...state.error, requests: true } }));
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set((state) => ({ loading: { ...state.loading, requests: false } }));
    }
  },

  // Accept a friend request
  acceptRequest: async (request) => {
    const {
      _id,
      sender: { username, profilePicture, _id: id },
    } = request;
    set((state) => ({ loading: { ...state.loading, action: true, id: _id } }));
    try {
      await axiosInstance.post(`/friends/accept/${_id}`);
      // Update the authUser state
      useAuthStore.setState((state) => ({
        authUser: {
          ...state.authUser,
          friends: [
            ...state.authUser.friends,
            {
              _id: id,
              username: username,
              profilePicture: profilePicture,
            },
          ],
        },
      }));
      // Remove the request from the requests array
      set((state) => ({
        requests: state.requests.filter((request) => request._id !== _id),
      }));
      toast.success("Friend request accepted");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, action: true } }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, action: false, id: null },
      }));
    }
  },
  // Reject a friend request
  rejectRequest: async (requestId) => {
    set((state) => ({
      loading: { ...state.loading, action: true, id: requestId },
    }));
    try {
      await axiosInstance.post(`/friends/reject/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((request) => request._id !== requestId),
      }));
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, action: true } }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, action: false, id: null },
      }));
    }
  },
  // Send a friend request
  sendRequest: async (userId) => {
    set((state) => ({
      loading: { ...state.loading, action: true, id: userId },
    }));
    try {
      const response = await axiosInstance.post(`/friends/send/${userId}`);
      set((state) => ({
        sentRequests: [
          ...state.sentRequests,
          { _id: response.data.requestId, receiver: { _id: userId } },
        ],
      }));
      toast.success("Friend request sent");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, action: true } }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, action: false, id: null },
      }));
    }
  },
  // Remove a friend
  removeFriend: async (friendId) => {
    set((state) => ({
      loading: { ...state.loading, action: true, id: friendId },
    }));
    try {
      await axiosInstance.delete(`/friends/remove/${friendId}`);

      useAuthStore.setState((state) => ({
        authUser: {
          ...state.authUser,
          friends: state.authUser.friends.filter(
            (friend) => friend._id !== friendId
          ),
        },
      }));

      toast.success("Friend removed successfully");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, action: true } }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, action: false, id: null },
      }));
    }
  },
  // Cancel a friend request
  cancelRequest: async (requestId) => {
    set((state) => ({
      loading: { ...state.loading, action: true, id: requestId },
    }));
    try {
      await axiosInstance.delete(`/friends/cancel/${requestId}`);
      set((state) => ({
        sentRequests: state.sentRequests.filter(
          (request) => request._id !== requestId
        ),
      }));
      toast.success("Friend request canceled");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, action: true } }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, action: false, id: null },
      }));
    }
  },
  // Get sent friend requests
  getSentRequests: async () => {
    set((state) => ({ loading: { ...state.loading, requests: true } }));
    try {
      const response = await axiosInstance.get("/friends/sent");
      set({ sentRequests: response.data.requests });
    } catch (error) {
      set((state) => ({ error: { ...state.error, requests: true } }));
      toast.error(formatError(error), { duration: 5000 });
    } finally {
      set((state) => ({ loading: { ...state.loading, requests: false } }));
    }
  },
}));
