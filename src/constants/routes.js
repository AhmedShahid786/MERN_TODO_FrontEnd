const dev = "http://localhost:4000";

const baseUrl = dev;

export const routes = {
  signup: baseUrl + "/auth/signup",
  login: baseUrl + "/auth/login",
  userInfo: baseUrl + "/user/info",
  addTask: baseUrl + "/tasks",
  getTask: baseUrl + "/tasks",
  deleteTask: baseUrl + "/tasks/", // + id
  updateTask: baseUrl + "/tasks/", // + id
};
