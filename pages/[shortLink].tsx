import type { GetServerSideProps, NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import ILink from "../interfaces/link";
import { getLink, incrementViewsOnLink } from "../services/link";
import styles from "../styles/ShortLink.module.scss";
import { BsDoorOpenFill } from "react-icons/bs";
import { checkPasswordOnLink, CheckPasswordOnLinkData } from "../services/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type ShortLinkRedirectProps = {
  link: ILink;
};

type FormInput = {
  password: string;
};

const ShortLinkRedirect: NextPage<ShortLinkRedirectProps> = ({
  link,
}: ShortLinkRedirectProps) => {
  const { t } = useTranslation("shortLink");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInput>();

  const router = useRouter();

  const setPasswordMutation = useMutation(
    (checkPasswordOnLinkData: CheckPasswordOnLinkData) =>
      checkPasswordOnLink(checkPasswordOnLinkData),
    {
      onSuccess: (data) => {
        setPasswordMutation.reset();
        incrementViewsOnLink(link.shortLink as string).then(() =>
          router.push(data.fullLink)
        );
      },
      onError: () => {
        setPasswordMutation.reset();

        setError("password", { type: "custom", message: t("wrongPassword") });
      },
    }
  );

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setPasswordMutation.mutate({
      shortLink: link.shortLink,
      password: data.password,
    });
  };

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <main className={styles.wrapper}>
        <h1>{t("header")}</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="password">{t("form.label")}</label>
          {setPasswordMutation.isIdle && (
            <input
              type="password"
              placeholder={t("form.placeholder")}
              {...register("password", {
                required: t("form.required"),
                minLength: {
                  value: 6,
                  message: t("form.minLength"),
                },
                maxLength: {
                  value: 32,
                  message: t("form.maxLength"),
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,32}$/,
                  message: t("form.pattern"),
                },
              })}
            />
          )}
          {setPasswordMutation.isLoading && (
            <input
              type="text"
              value={t("form.loading")}
              name="password"
              id="password"
              readOnly
            />
          )}
          {errors.password?.message && (
            <p className={styles.errors}>{errors.password?.message}</p>
          )}

          <button type="submit">
            {t("form.follow")} <BsDoorOpenFill />
          </button>
        </form>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const shortLink = context?.params?.shortLink;

  const res = await getLink(shortLink as string, true);

  const result = await res;

  if (result !== null) {
    if (result?.password === "") {
      await incrementViewsOnLink(shortLink as string, true);

      return {
        redirect: {
          destination: result?.fullLink ?? "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          link: result,
          ...(await serverSideTranslations(context.locale as string, [
            "shortLink",
            "navbar",
          ])),
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default ShortLinkRedirect;
