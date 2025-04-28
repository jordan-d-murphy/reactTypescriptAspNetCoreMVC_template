export function getUserId(): string | null {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return user?.id || null;
}
