export const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  return response;
};
