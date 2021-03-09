import axios from "axios";

function getDasboard() {
  return axios.get("/api/users/dashboard");
}

export const apiUsers = {
  getDasboard,
};