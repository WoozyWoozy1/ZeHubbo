import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  const calledRef = useRef(false); // prevent double execution

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("http://localhost:8000/anilist/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Token exchange success:", data);
          if (data.access_token) {
            localStorage.setItem("anilist_token", data.access_token);
          }
          navigate("/");
        })
        .catch((err) => {
          console.error("Token exchange failed:", err);
          navigate("/");
        });
    } else {
      console.warn("No code found in URL");
      navigate("/");
    }
  }, [navigate]);

  return <p className="p-4">Authorizing with AniList...</p>;
}
