import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/shared/api/client";
import "~/shared/styles/globals.css";
import { Button } from "~/shared/ui/button";
import { Navigation } from "~/shared/ui/navigation";

export const metadata: Metadata = {
  title: "Meal planner",
  description: "Meal planning and tracking",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/login"
      signInUrl="/login"
      signUpUrl="/register"
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className={`dark ${geist.variable}`}>
        <body className="flex min-h-screen flex-col">
          <header className="flex h-16 items-center justify-end gap-2 p-4">
            <SignedOut>
              <Button variant={"outline"} asChild>
                <SignInButton />
              </Button>
              <Button asChild>
                <SignUpButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <div className="flex w-full items-center justify-between">
                <Navigation />
                <UserButton />
              </div>
            </SignedIn>
          </header>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
