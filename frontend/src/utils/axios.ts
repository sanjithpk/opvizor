import Axios from "axios"

const PROD = process.env.NODE_ENV === "production"

export const axios = Axios.create({
  baseURL: PROD
    ? "https://opvizor-backend-dot-hu18-groupa-angular.et.r.appspot.com"
    : "http://localhost:8080",
  withCredentials: true
})
