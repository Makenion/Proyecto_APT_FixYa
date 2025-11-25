import { Cloudinary } from "@cloudinary/url-gen";
import axios from 'axios';

const apiUrl          = process.env.EXPO_PUBLIC_API_URL

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dwrwhzxi4'
  },
  url: {
    secure: true
  }
});

export const api = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupAuthInterceptor = (signOut : any) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("Token inválido o expirado. Realizando logout.");
        await signOut();
      }
      return Promise.reject(error);
    }
  );
};