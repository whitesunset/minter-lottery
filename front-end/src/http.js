import axios from "axios";

let baseUrl;
if (process.env.NODE_ENV === "production") {
  baseUrl = "http://5.188.41.218:3002/api/";
} else {
  baseUrl = "http://localhost:3002/api/";
}

export const HTTP = axios.create({
  baseURL: baseUrl
});
