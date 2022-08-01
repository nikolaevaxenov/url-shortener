import type { NextPage } from "next";
import Head from "next/head";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import styles from "../styles/Profile.module.scss";
import ILink from "../interfaces/link";
import LinkCard from "../components/LinkCard/LinkCard";
import LinkMiniCard from "../components/LinkMiniCard/LinkMiniCard";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { chooseCard } from "../features/profileLinkCard/cardSlice";

type ProfileProps = {
  links: ILink[];
};

const Profile: NextPage<ProfileProps> = ({ links }: ProfileProps) => {
  const idCard = useAppSelector((state) => state.card.idCard);
  const dispatch = useAppDispatch();

  return (
    <>
      <Head>
        <title>Личный кабинет</title>
      </Head>
      <main className={styles.wrapper}>
        <div className={styles.wrapper__leftSide}>
          <p className={styles.wrapper__linkCount}>{links.length} ссылок</p>
          {links.map((link) => (
            <div
              className={styles.wrapper__linkCard}
              key={link._id}
              onClick={() => dispatch(chooseCard(link._id))}
            >
              <LinkMiniCard link={link} />
            </div>
          ))}
        </div>
        <div className={styles.wrapper__rightSide}>
          {idCard !== "null" && (
            <LinkCard
              link={
                links.find((link) => link._id === idCard) ?? {
                  _id: "lorem",
                  shortLink: "lorem",
                  fullLink: "lorem",
                  expiryDate: "lorem",
                  createdAt: "lorem",
                }
              }
            />
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = withPageAuthRequired({
  returnTo: "/",
  async getServerSideProps(context) {
    const session = getSession(context.req, context.res);

    const res = await fetch(
      `${process.env.APP_URL}/api/links/user/${session?.user.email}`,
      {
        method: "get",
      }
    );

    const result = await res.json();
    console.log("Result = ", result);

    return {
      props: {
        links: result,
      },
    };
  },
});

export default Profile;
