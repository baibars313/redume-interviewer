import axios from 'axios';
import { useMemo } from 'react';
import { API_URL } from '../compnents/constant';
import { useAuthStore } from '../store/useAuthstore';

export function useAuthApi() {
  const token = useAuthStore((state) => state.token);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL:API_URL,
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    });

    return instance;
  }, [token, API_URL]);

  const get = (url, config) =>
    api.get(url, config).then((res) => res);

  const post = (url, data, config) =>
    api.post(url, data, config).then((res) => res);

  const put = (url, data, config) =>
    api.put(url, data, config).then((res) => res);

  const del = (url, config) =>
    api.delete(url, config).then((res) => res);

  return { get, post, put, delete: del, instance: api };
}
