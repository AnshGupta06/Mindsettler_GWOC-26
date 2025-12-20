import SignupForm from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2743, #1b3a5f)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "120px", // keeps box a little lower
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          padding: "36px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <SignupForm />
      </div>
    </div>
  );
}
