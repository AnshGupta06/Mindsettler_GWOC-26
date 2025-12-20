import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0b2a4a, #06182c)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
         paddingTop: "100px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          width: "420px",
          padding: "36px",
         
          borderRadius: "16px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        }}
      >
        <LoginForm />
      </div>
    </div>
  );
}
