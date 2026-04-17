"use client";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getFriendlyAuthMessage } from "@/src/utils/api";

export default function GoogleLoginBtn({ text = "continue_with", useOneTap = false }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const signInWithGoogle = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse?.access_token;
      if (!accessToken) {
        setErrorMessage("Google did not return an access token.");
        return;
      }

      setLoading(true);
      setErrorMessage("");
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/social/google/`, {
          access_token: accessToken,
        });

        localStorage.setItem("authToken", res.data.key);
        router.push("/");
      } catch (error) {
        const apiDetail = getFriendlyAuthMessage(
          error,
          "Google login failed. Please try again.",
          "google"
        );
        console.error("Google login failed", error?.response?.data || error);
        setErrorMessage(apiDetail);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setErrorMessage("Google sign-in was cancelled or blocked.");
    },
  });

  return (
    <div className="my-5 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => signInWithGoogle()}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white px-5 py-3 text-sm font-medium text-[#3c4043] shadow-[0_1px_2px_rgba(60,64,67,0.2)] transition hover:bg-[#f8f9fa] hover:shadow-[0_2px_3px_rgba(60,64,67,0.25)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.7 3.3 14.5 2.4 12 2.4 6.9 2.4 2.8 6.6 2.8 11.9S6.9 21.4 12 21.4c6.8 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.2H12z"
            />
            <path
              fill="#4285F4"
              d="M21.1 13.1H12v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9v3.2c4.8 0 8.7-4 8.7-9 0-.6-.1-1.2-.2-1.8z"
            />
            <path
              fill="#FBBC05"
              d="M6.4 14.2c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.2H3.1C2.4 8.6 2 10.2 2 11.9s.4 3.3 1.1 4.7l3.3-2.4z"
            />
            <path
              fill="#34A853"
              d="M12 21.4c2.5 0 4.7-.8 6.3-2.2l-3-2.3c-.8.6-1.9 1-3.3 1-2.6 0-4.8-1.8-5.6-4.2l-3.3 2.4C4.7 19.2 8.1 21.4 12 21.4z"
            />
            <path
              fill="none"
              d="M2 2h20v20H2z"
            />
          </svg>
        </span>
        {loading ? "Connecting..." : text === "signup_with" ? "Sign up with Google" : "Sign in with Google"}
      </button>

      {errorMessage && (
        <p className="max-w-sm text-center text-xs text-rose-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
