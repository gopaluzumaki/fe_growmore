// src/hooks/useApi.ts
import { useState } from "react";
import axios, { AxiosError } from "axios";

const useApi = (baseUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logError = (error: AxiosError) => {
    console.error("API error:", error);
  };

  const get = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      logError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const post = async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error) {
      logError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const put = async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${baseUrl}${endpoint}`, data);
      return response.data;
    } catch (error) {
      logError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${baseUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      logError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return { get, post, put, remove, loading, error };
};

export default useApi;
