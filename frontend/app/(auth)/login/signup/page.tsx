import SignupForm from "../components/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9F6FF] relative overflow-hidden py-10">
      {/* 🎨 Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3F2965]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#Dd1764]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10 px-4">
        <SignupForm />
        <p className="mt-6 text-center text-[#3F2965]/60 text-sm mb-10">
          Already have an account?{" "}
          <Link href="/login" className="text-[#Dd1764] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}