"use client";

import { SignIn, SignedIn, SignedOut, useUser, SignOutButton, useAuth } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs/server"
// import styles from '../styles/SignIn.module.css'
import { neobrutalism } from "@clerk/themes";


export default function HomePage() {
  const { user } = useUser();

  const { isLoaded, userId, orgId, sessionId } = useAuth();

  console.log("Client-side auth:", { isLoaded, userId, orgId, sessionId }); // shows in browser console
//   const authData = auth();
//   console.log("AUTH DATA:", authData);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <SignedOut>
        {/* Show full sign-in widget on home page */}
        <div className="w-[400px]">
          <SignIn
            path="/"
            routing="path"
            signUpUrl="/sign-up"
            afterSignInUrl="/"   // 👈 this line ensures you stay on the homepage
            afterSignUpUrl="/"   // 👈 same for sign-up
            appearance={{
              elements: {
                formButtonPrimary: "styles.primaryColor",
                baseTheme: neobrutalism,
              },
            }}
          />
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome back, {user?.firstName || "friend"} 👋
          </h1>

          <SignOutButton signOutCallback={() => window.location.replace("/")}>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </SignedIn>
    </main>
  );
}
