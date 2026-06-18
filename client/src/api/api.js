import axios from "axios";

const API = axios.create({
  baseURL: "http://10.69.1.178:5000/api",
});

export default API;