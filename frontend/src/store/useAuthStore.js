import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { formatError } from "../utils/formatError.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  loading: {
    signup: false,
    login: false,
    updateProfile: false,
  },
  error: {
    signup: false,
    login: false,
    updateProfile: false,
  },
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/user");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  userSignup: async (data) => {
    set((state) => ({ loading: { ...state.loading, signup: true } }));
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, signup: true } }));
    } finally {
      set((state) => ({ loading: { ...state.loading, signup: false } }));
    }
  },

  userLogin: async (data) => {
    set((state) => ({ loading: { ...state.loading, login: true } }));
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ error: { ...state.error, login: true } }));
    } finally {
      set((state) => ({ loading: { ...state.loading, login: false } }));
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(formatError(error));
    }
  },

  updProfile: async (data) => {
    set((state) => ({ loading: { ...state.loading, updateProfile: true } }));
    try {
      const res = await axiosInstance.patch("/auth/update", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(formatError(error), { duration: 5000 });
      set((state) => ({ loading: { ...state.error, updateProfile: true } }));
    } finally {
      set((state) => ({ loading: { ...state.loading, updateProfile: false } }));
    }
  },
}));
