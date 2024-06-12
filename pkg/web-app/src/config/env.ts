const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL env is not defined");
}

export const env = {
  API_URL
}
