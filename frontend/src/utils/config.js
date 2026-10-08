const rawUrl = import.meta.env.VITE_BACKEND_URL || "https://bookheaven-j0pj.onrender.com";
export const Server_URL = rawUrl.endsWith("/") ? rawUrl : `${rawUrl}/`;

