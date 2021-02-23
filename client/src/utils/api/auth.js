import axios from "axios";

function login(email, password) {
  return axios
    .post("/api/auth/login", {
      email,
      password,
    })
    .then((res) => {
      setAuth(res.data.token);
      return res.data.token;
    });
}

function register(email, password, displayName) {
  return axios
    .post("/api/auth/register", {
      email,
      password,
      displayName,
    })
    .then((res) => {
      setAuth({ token: res.data.token });
      return res.data.token;
    });
}

function logout() {
  localStorage.removeItem("authentication");
  window.location.reload();
}

function getAuth() {
  const auth = JSON.parse(localStorage.getItem("authentication"));
  if (auth) {
    setDefaults(auth.token);
    return auth;
  }
  return null;
}

function setAuth(obj = {}) {
  localStorage.setItem("authentication", JSON.stringify(obj));
  setDefaults(obj.token);
}

function setDefaults(token) {
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
}

export const apiAuth = {
  login,
  logout,
  register,
  getAuth,
  setAuth,
};