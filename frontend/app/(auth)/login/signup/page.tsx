// app/(auth)/login/signup/page.tsx
import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6FF] px-4 py-12">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
