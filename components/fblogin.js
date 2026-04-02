"use client";
import React from "react";
import FacebookLogin from "react-facebook-login-lite";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function FacebookLoginBtn() {
  const router = useRouter();

  const handleFBResponse = async (response) => {
    if (!response?.accessToken) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/social/facebook/`, {
        access_token: response.accessToken,
      });

      localStorage.setItem("authToken", res.data.key);
      router.push("/");
    } catch (error) {
      console.error("Facebook login failed", error);
      alert("Facebook login failed");
    }
  };

  return (
    <div className="my-4">
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
        onSuccess={handleFBResponse}
        onFail={(err) => console.log("Facebook login failed", err)}
        onProfileSuccess={(res) => console.log("FB profile", res)}
      />
    </div>
  );
}
