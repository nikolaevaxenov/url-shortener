import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const { user, error, isLoading } = useUser();

  return (
    <header>
      <nav className={styles.navbar}>
        <div>
          <Link href="/">
            <a className={styles.navbar__logo}>GoShort</a>
          </Link>
        </div>
        <div className={styles.navbar__links}>
          {user ? (
            <>
              <Link href="/profile">
                <a className={styles.navbar__link}>{user.email}</a>
              </Link>
              <Link href="/api/auth/logout">
                <a className={styles.navbar__link}>Выйти</a>
              </Link>
            </>
          ) : (
            <>
              <Link href="/api/auth/login">
                <a className={styles.navbar__link}>
                  Войти / Зарегистрироваться
                </a>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
