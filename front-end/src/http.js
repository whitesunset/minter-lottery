import axios from "axios";

let baseUrl;
if (process.env.NODE_ENV === "production") {
  baseUrl = "http://82.202.221.175:3002/api/";
} else {
  baseUrl = "http://localhost:3002/api/";
}

export const HTTP = axios.create({
  baseURL: baseUrl
});
