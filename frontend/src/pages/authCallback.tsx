import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("http://localhost:8000/anilist/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          console.log("Token exchange success:", data);
          // Optionally store token here (e.g., localStorage.setItem("anilist_token", data.access_token))
          navigate("/"); // redirect home after import
        })
        .catch(err => {
          console.error("Token exchange failed:", err);
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <p className="p-4">Authorizing with AniList...</p>;
}
