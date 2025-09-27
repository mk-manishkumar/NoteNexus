import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Auth API
export const authApi = {
  register: (data: { username: string; name: string; age: number; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/me"),
  guestSignIn: () => api.post("/auth/guest-signin"),
};

// Profile API
export const profileApi = {
  getProfile: (username: string) => api.get(`/profile/${username}`),
  updateProfile: (username: string, data: { username: string; age: number; name: string; email: string }) =>
    api.put(`/profile/${username}`, data),
  changePassword: (username: string, data: { oldPassword: string; newPassword: string }) =>
    api.put(`/profile/${username}/change-password`, data),
  deleteProfile: (username: string, data: { password: string }) =>
    api.delete(`/profile/${username}`, { data }),
};

// Notes API
export const notesApi = {
  fetchNotes: () => api.get("/notes"),
  addNote: (data: { title: string; description: string }) => api.post("/notes/addnotes", data),
  deleteNote: (noteId: string) => api.delete(`/notes/${noteId}`),
  archiveNote: (noteId: string) => api.put(`/notes/${noteId}/archive`),
  clearAllNotes: () => api.delete("/notes"),
  getNote: (slug: string) => api.get(`/notes/${slug}`),
  updateNote: (slug: string, data: { title: string; description: string }) => api.put(`/notes/${slug}`, data),
  searchNotes: (query: string) => api.get(`/notes/search`, { params: { search: query } }),
};

// Bin API
export const binApi = {
  fetchDeletedNotes: () => api.get("/bin"),
  restoreFromBin: (noteId: string) => api.put(`/bin/${noteId}/restore`),
  deleteFromBin: (noteId: string) => api.delete(`/bin/${noteId}`),
  clearBin: () => api.delete("/bin"),
  searchBin: (query: string) => api.get(`/bin/search`, { params: { search: query } }),
};

// Archive API
export const archiveApi = {
  fetchArchivedNotes: () => api.get("/archive"),
  deleteFromArchive: (noteId: string) => api.delete(`/archive/${noteId}`),
  restoreFromArchive: (noteId: string) => api.put(`/archive/${noteId}/restore`),
  clearArchive: () => api.delete("/archive"),
  searchArchive: (query: string) => api.get(`/archive/search`, { params: { q: query } }),
};

export default api;
