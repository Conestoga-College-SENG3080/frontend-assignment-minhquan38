"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await fetch("https://awf-api.lvl99.dev/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "vkhuong2363",
            password: "8822363",
          }),
        });

        const data = await response.json();
        console.log("Response:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendRequest();
  }, []);

  return <h1>Main Page</h1>;
}