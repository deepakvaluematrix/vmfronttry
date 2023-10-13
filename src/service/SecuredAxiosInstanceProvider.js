import axios from "axios";
import ls from 'localstorage-slim';

const createSecureAxiosClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });

  const token = ls.get("access_token",{decrypt:true});

  instance.defaults.headers.Authorization = token ? `${token}` : "";
  return instance;
};

export default createSecureAxiosClient;
