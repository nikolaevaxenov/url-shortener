import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <header>
      <nav className={styles.navbar}>
        <div>
          <Link href="/">
            <a className={styles.navbar__logo}>GoShort</a>
          </Link>
        </div>
        <div className={styles.navbar__links}>
          <Link href="/login">
            <a className={styles.navbar__link}>Войти</a>
          </Link>
          <Link href="/signup">
            <a className={styles.navbar__link}>Зарегистрироваться</a>
          </Link>
        </div>
      </nav>
    </header>
  );
}
