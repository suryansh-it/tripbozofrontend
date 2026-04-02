"use client";
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function GoogleLoginBtn() {
  const router = useRouter();

  const handleSuccess = async (credentialResponse) => {
    const accessToken = credentialResponse?.credential;
    if (!accessToken) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/social/google/`, {
        access_token: accessToken,
      });

      localStorage.setItem("authToken", res.data.key);
      router.push("/");
    } catch (error) {
      console.error("Google login failed", error);
      alert("Google login failed");
    }
  };

  return (
    <div className="my-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google Login Failed")}
        useOneTap
      />
    </div>
  );
}
