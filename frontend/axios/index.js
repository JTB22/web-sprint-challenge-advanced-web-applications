// ✨ implement axiosWithAuth
import axios from "axios";

export const axiosAuth = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    headers: {
      Authorization: token,
    },
  });
};
