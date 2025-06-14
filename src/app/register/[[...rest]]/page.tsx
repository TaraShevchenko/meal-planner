import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <SignUp
        // appearance={{
        //   elements: {
        //     formButtonPrimary:
        //       "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
        //     card: "shadow-lg",
        //     headerTitle: "text-2xl font-bold text-gray-900",
        //     headerSubtitle: "text-gray-600",
        //   },
        // }}
        fallbackRedirectUrl="/"
      />
    </div>
  );
}
