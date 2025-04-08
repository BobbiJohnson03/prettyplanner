export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const login = (token: string): void => {
  localStorage.setItem("token", token);
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
