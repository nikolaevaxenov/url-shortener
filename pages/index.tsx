import type { NextPage } from "next";
import { useUser } from "@auth0/nextjs-auth0";
import { useForm } from "react-hook-form";
import { AiOutlineCopy, AiOutlineReload } from "react-icons/ai";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "@tanstack/react-query";
import { createLink, LinkData } from "../services/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type FormData = {
  fullLink: string;
};

const Home: NextPage = () => {
  const { user } = useUser();
  const { t } = useTranslation("index");
  const { register, handleSubmit, reset } = useForm<FormData>();
  const createLinkMutation = useMutation((linkData: LinkData) =>
    createLink(linkData)
  );

  const resultLink = useRef<HTMLInputElement>(null);

  const submitHandler = ({ fullLink }: FormData) => {
    createLinkMutation.mutate({
      fullLink,
      userId: user?.email ?? null,
    });
  };

  const handleCopy = () => {
    if (resultLink.current) {
      resultLink.current.select();

      toast.success(t("successCopyToast"), {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <Head>
        <title>GoShort</title>
      </Head>
      <main className={styles.main}>
        <p className={styles.main__title}>GoShort</p>
        <p className={styles.main__subText}>{t("description")}</p>
        {createLinkMutation.isIdle && (
          <div id="inputForm" className={styles.main__inputGroup}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <input
                type="url"
                placeholder={t("form.placeholder")}
                className={styles.main__urlInput}
                required
                {...register("fullLink")}
              />
              <button type="submit" className={styles.main__urlButton}>
                {t("form.buttonShorten")}
              </button>
            </form>
          </div>
        )}
        {createLinkMutation.isLoading && (
          <div className={styles.main__inputGroup}>
            <input
              readOnly
              value={t("form.loading")}
              className={styles.main__urlInput}
            />
          </div>
        )}
        {createLinkMutation.isSuccess && (
          <>
            <div id="resultForm" className={styles.main__inputGroup}>
              <input
                ref={resultLink}
                readOnly
                className={styles.main__urlInput}
                value={`https://goshort.ga/${createLinkMutation.data.shortLink}`}
                onClick={(e) => e.currentTarget.select()}
              />

              <CopyToClipboard
                text={`https://goshort.ga/${createLinkMutation.data.shortLink}`}
                onCopy={() => handleCopy()}
              >
                <button type="button" className={styles.main__urlButton}>
                  {t("form.buttonCopy")} <AiOutlineCopy />
                </button>
              </CopyToClipboard>
            </div>
            <button
              type="button"
              className={styles.main__reloadButton}
              onClick={() => {
                createLinkMutation.reset();
                reset();
              }}
            >
              {t("form.buttonReload")} <AiOutlineReload />
            </button>
          </>
        )}

        <p className={styles.main__adText}>{t("bottomDescription")}</p>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
        />
      </main>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["index", "navbar"])),
    },
  };
}

export default Home;
