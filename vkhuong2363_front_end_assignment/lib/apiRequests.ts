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

export async function fetchForums(token:string){
  const response = await fetch("https://awf-api.lvl99.dev/forums", 
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Fail to fetch forums");
  }

  return response.json();
}

export async function fetchPostBySlug(token:string, slug:string){
  const response = await fetch(`https://awf-api.lvl99.dev/forums/${slug}?sortBy=hot&limit=10`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Fail to fetch post");
  }

  return response.json();
}