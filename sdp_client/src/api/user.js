import axios from "axios";

const user = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default user;
