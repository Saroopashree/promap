export const getSessionToken = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user?.token || "";
};

export const currentUserName = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user?.username || "";
};

export const getChannelId = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user?.channelId || "";
};

export const getActiveProject = () => {
  return localStorage.getItem("currentProject");
};
