import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-lg",
            headerTitle: "text-xl font-semibold",
            headerSubtitle: "text-gray-600",
          },
        }}
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
