
export const convertDate = (date: number) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(date).toLocaleDateString("en-GB", options);
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    if (!endpoint) {
      throw new Error("No endpoint provided");
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const testEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};