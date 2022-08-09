import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import styles from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { GoSignOut } from "react-icons/go";
import { Turn as Hamburger } from "hamburger-react";
import classnames from "classnames";
import "animate.css";

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation("navbar");
  const selectRef = useRef<HTMLSelectElement>(null);
  const menuDivRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);

  const handleLocaleChange = () => {
    router.push(router.route, router.asPath, {
      locale: selectRef?.current?.value,
    });
  };

  return (
    <header>
      <nav className={styles.navbar}>
        <div>
          <Link href="/">
            <a className={styles.navbar__logo}>GoShort</a>
          </Link>
        </div>
        <div className={styles.navbar__links}>
          <div className={styles.navbar__desktop}>
            <select
              onChange={handleLocaleChange}
              ref={selectRef}
              value={router.locale}
            >
              <option value="ru">🇷🇺 Русский</option>
              <option value="en">🇺🇸 English</option>
            </select>
            {user ? (
              <>
                <Link href="/profile">
                  <div className={styles.profileLinks}>
                    <a className={styles.navbar__link}>{user.email}</a>
                  </div>
                </Link>
                <Link href="/api/auth/logout">
                  <a className={styles.navbar__link}>
                    <GoSignOut />
                  </a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/api/auth/login">
                  <a className={styles.navbar__link}>{t("loginRegister")}</a>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className={styles.navbar__mobile}>
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            onToggle={(toggled) => {
              if (menuDivRef.current) {
                if (toggled) {
                  menuDivRef.current.style.display = "flex";
                } else {
                  menuDivRef.current.style.opacity = "0";
                }
              }
            }}
          />
          <div
            ref={menuDivRef}
            className={classnames(
              styles.navbar__box,
              "animate__animated",
              isOpen ? "animate__fadeInLeft" : "animate__fadeOutLeft"
            )}
          >
            <select
              onChange={handleLocaleChange}
              ref={selectRef}
              value={router.locale}
            >
              <option value="ru">🇷🇺 Русский</option>
              <option value="en">🇺🇸 English</option>
            </select>
            {user ? (
              <>
                <Link href="/profile">
                  <div className={styles.profileLinks}>
                    <a className={styles.navbar__link}>{user.email}</a>
                  </div>
                </Link>
                <Link href="/api/auth/logout">
                  <a className={styles.navbar__link}>{t("exit")}</a>
                </Link>
              </>
            ) : (
              <>
                <Link href="/api/auth/login">
                  <a className={styles.navbar__link}>{t("loginRegister")}</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
