import Link from "next/link";
import styles from "./Header.module.css";

type Props = { active?: "home" | "ui-kit" };

export default function Header({ active = "home" }: Props) {
  return (
    <header className={styles.header}>
      <nav className={styles.left} aria-label="Primary">
        <Link href="/" className={styles.brand} aria-label="FRAMR — home">
          FRAMR.
        </Link>
        <Link href="/walkthrough" className={styles.kit}>
          WALKTHROUGH
        </Link>
        {active === "ui-kit" ? (
          <Link href="/" className={styles.kit}>
            ← BACK TO APP
          </Link>
        ) : (
          <Link href="/ui-kit" className={styles.kit}>
            SEE UI KIT
          </Link>
        )}
      </nav>
      <p className={styles.tag}>THIS → EVERY SOCIAL.</p>
    </header>
  );
}
