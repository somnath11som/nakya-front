import axios from "axios";
import { toast } from "react-toastify";

export const postAPI = (path, body, token) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_BACKEND_API}${path}`,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    data: JSON.stringify(body),
  };

  return axios(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      toast.error("Something went wrong! Please contact to the administrator");
      console.log(error);
    });
};

export const apiCallBack = async (method, slug, payload, token) => {
  let path = `${import.meta.env.VITE_BACKEND_API}${slug}`;

  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: path,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // Conditionally set the Content-Type based on the payload
    ...(payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" }),
    data: payload,
  };

  return axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};
