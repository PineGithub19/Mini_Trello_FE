const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH_TOKEN: "/auth/refresh",
  LOGOUT: "/auth/logout",

  USER_PROFILE: "/users/me",

  DASHBOARD: "/",

  WORKSPACES_CREATE: "/workspaces",
  WORKSPACES_LIST: "/workspaces",
  COLABORATED_WORKSPACE_LIST: "/workspaces/colaborated",

  WORKSPACE_MEMBERS_ADD: "/workspace-members",
  WORKSPACE_MEMBERS_LIST: "/workspace-members",
  WORKSPACE_MEMBERS_REMOVE: "/workspace-members",

  PROJECTS_CREATE: "/projects",
  PROJECTS_LIST: "/projects",
  PROJECT_DETAIL: "/projects/:projectId",

  TASKS_CREATE: "/tasks",
  TASKS_LIST: "/tasks",
  TASK_DETAIL: "/tasks/:taskId",
  TASKS_UPDATE: "/tasks/:taskId",

  LISTS_CREATE: "/lists",
  LISTS: "/lists",
  LIST_DETAIL: "/lists/:listId",
  LISTS_UPDATE: "/lists/:listId",
  LISTS_DELETE: "/lists/:listId",

  UPLOAD_IMAGE: "/supabase/upload",
  DEFAULT_IMAGES: "/supabase/defaults",
};

export default ENDPOINTS;
