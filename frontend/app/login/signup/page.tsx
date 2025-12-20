import SignupForm from "../components/SignupForm";
import styles from "../styles/auth-layout.module.css";

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <SignupForm />
      </div>
    </div>
  );
}
