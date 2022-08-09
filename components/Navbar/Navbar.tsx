import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import styles from "./Navbar.module.scss";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Turn as Hamburger } from "hamburger-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import classnames from "classnames";
import "animate.css";

export default function Navbar() {
  const { user, isLoading } = useUser();
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

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (menuDivRef.current) {
      if (!isMobile) {
        menuDivRef.current.style.display = "flex";
      } else {
        if (isOpen) {
          menuDivRef.current.style.display = "flex";
        } else {
          const timer = setTimeout(() => {
            if (menuDivRef.current) {
              menuDivRef.current.style.display = "none";
            }
          }, 1000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [isMobile, isOpen]);

  return (
    <header>
      <nav className={styles.navbar}>
        <div>
          <Link href="/">
            <a className={styles.navbar__logo}>GoShort</a>
          </Link>
        </div>
        <div className={styles.navbar__links}>
          <div className={styles.navbar__hamburger}>
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </div>
          <div
            ref={menuDivRef}
            className={classnames(
              styles.navbar__box,
              isMobile ? "animate__animated" : "",
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
            {isLoading ? (
              t("loading")
            ) : user ? (
              <>
                <Link href="/profile">
                  <a className={styles.navbar__link}>{user.email}</a>
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
