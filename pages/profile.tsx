import type { NextPage } from "next";
import Head from "next/head";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import styles from "../styles/Profile.module.scss";
import ILink from "../interfaces/link";
import LinkCard from "../components/LinkCard/LinkCard";
import LinkMiniCard from "../components/LinkMiniCard/LinkMiniCard";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { chooseCard, editCard } from "../features/profileLinkCard/cardSlice";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getUserLinks } from "../services/link";
import { UserData } from "auth0";
import { AiFillEye } from "react-icons/ai";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type ProfileProps = {
  user: UserData;
};

const Profile: NextPage<ProfileProps> = ({ user }) => {
  const { t } = useTranslation("profile");

  const idCard = useAppSelector((state) => state.card.idCard);
  const editState = useAppSelector((state) => state.card.editState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { refetch, data, isLoading } = useQuery(
    ["links", user.user_id as string],
    () => getUserLinks(user.user_id as string)
  );

  const viewsCounterMemo = useMemo(
    () =>
      data?.reduce((sumViews: number, link: ILink) => sumViews + link.views, 0),
    [data]
  );

  const [linkCard, setLinkCard] = useState(<></>);

  useEffect(() => {
    refetch();
  }, [refetch, editState]);

  useEffect(() => {
    if (idCard === "deleted") {
      toast.error(t("linkDeletedToast"), {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      dispatch(chooseCard("null"));
      refetch();
    } else if (idCard === "null") {
      setLinkCard(<></>);
    } else {
      setLinkCard(
        <LinkCard
          link={
            data?.find((link: ILink) => link._id === idCard) ?? {
              _id: "lorem",
              shortLink: "lorem",
              fullLink: "lorem",
              createdAt: "lorem",
              views: 123,
              password: "",
            }
          }
        />
      );
    }
  }, [data, dispatch, idCard, refetch, router, t]);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <main className={styles.wrapper}>
        {isLoading ? (
          <div>{t("loading")}</div>
        ) : (
          <div className={styles.wrapper__leftSide}>
            <div className={styles.wrapper__counters}>
              <p>
                {data?.length ?? 0} {t("links")}
              </p>
              <p>
                {viewsCounterMemo} <AiFillEye />
              </p>
            </div>
            {data?.map((link: ILink) => (
              <div
                className={styles.wrapper__linkCard}
                key={link._id}
                onClick={() => {
                  dispatch(chooseCard(link._id));
                  dispatch(editCard(false));
                }}
              >
                <LinkMiniCard link={link} />
              </div>
            ))}
          </div>
        )}
        <div className={styles.wrapper__rightSide}>{linkCard}</div>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
        />
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  returnTo: "/",
  async getServerSideProps(ctx) {
    return {
      props: {
        ...(await serverSideTranslations(ctx.locale as string, [
          "profile",
          "linkCard",
          "passwordProtectedLinkForm",
          "navbar",
        ])),
      },
    };
  },
});

export default Profile;
