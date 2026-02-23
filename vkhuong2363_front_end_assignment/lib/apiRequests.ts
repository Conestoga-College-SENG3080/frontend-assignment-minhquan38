export async function login(username: string, password: string) {
  const response = await fetch("https://awf-api.lvl99.dev/auth/login", 
  {
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}