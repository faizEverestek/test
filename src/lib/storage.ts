export const setToken = (
  accessToken: string,
  refreshToken: string,
  expiresAt: number
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("expiresAt", expiresAt.toString());
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const getExpiry = () => {
  const expiry = localStorage.getItem("expiresAt");
  return expiry ? parseInt(expiry, 10) : null;
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresAt");
};
