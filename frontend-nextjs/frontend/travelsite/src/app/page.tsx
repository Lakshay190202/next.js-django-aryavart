"use client";
import { useRouter } from "next/navigation";
import Header from "./components/header";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Header />
      <main className="main-div">
        <div className="container">
          <div className="container-blur-box">
            <div className="container-text">
              <p>Welcome to Arya Vart</p>
            </div>
            <div className="container-buttons-div">
              <button
                className="button-signin"
                type="button"
                onClick={() => router.push('/signin')}
              >
                Sign In
              </button>
              <button
                className="button-signup"
                type="button"
                onClick={() => router.push('/signup')}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}