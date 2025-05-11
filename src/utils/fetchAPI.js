import axios from "axios";

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
