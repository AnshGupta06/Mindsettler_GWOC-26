import LoginForm from "./components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9F6FF] relative overflow-hidden">
      {/* 🎨 Background Blobs for Atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#3F2965]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#Dd1764]/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md z-10 px-4">
        <LoginForm />
        <p className="mt-6 text-center text-[#3F2965]/60 text-sm">
          Don't have an account?{" "}
          <Link href="/login/signup" className="text-[#Dd1764] font-semibold hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}