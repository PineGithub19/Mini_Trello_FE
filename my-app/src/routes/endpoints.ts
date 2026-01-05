const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",

  USER_PROFILE: "/users/me",

  DASHBOARD: "/",

  WORKSPACES_CREATE: "/workspaces",
  WORKSPACES_LIST: "/workspaces",

  PROJECTS_CREATE: "/projects",
  PROJECTS_LIST: "/projects",

  UPLOAD_IMAGE: "/supabase/upload",
  DEFAULT_IMAGES: "/supabase/defaults",
};

export default ENDPOINTS;
