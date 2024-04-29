import axios, { AxiosInstance } from "axios";

const request: AxiosInstance = axios.create({
    headers: {
        "Content-Type": "application/json",
    }
})

export default request