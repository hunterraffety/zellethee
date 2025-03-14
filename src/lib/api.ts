"use client";

import { useLoading } from "@/app/components/LoadingContext";
import { useState } from "react";
import toast from "react-hot-toast";

export const useApi = () => {
  const { startLoading, stopLoading } = useLoading();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiCall = async <T>(
    url: string,
    options: RequestInit = {},
    showGlobalLoading = false,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    if (showGlobalLoading) startLoading();
    setIsSubmitting(true);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "API request failed");
      }

      const data = await response.json();

      if (successMessage) {
        toast.success(successMessage);
      }

      return data;
    } catch (err) {
      const errorMsg =
        (err as Error).message || errorMessage || "An error occurred";
      toast.error(errorMsg);
      throw err;
    } finally {
      setIsSubmitting(false);
      if (showGlobalLoading) stopLoading();
    }
  };

  return { apiCall, isSubmitting };
};
