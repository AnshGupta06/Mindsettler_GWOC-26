import LoginForm from "./components/LoginForm";
import styles from "./styles/auth-layout.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <LoginForm />
      </div>
    </div>
  );
}
