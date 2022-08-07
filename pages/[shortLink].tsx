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

type ShortLinkRedirectProps = {
  link: ILink;
};

type FormInput = {
  password: string;
};

const ShortLinkRedirect: NextPage<ShortLinkRedirectProps> = ({
  link,
}: ShortLinkRedirectProps) => {
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

        setError("password", { type: "custom", message: "Неверный пароль!" });
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
        <title>Переход по короткой ссылке</title>
      </Head>
      <main className={styles.wrapper}>
        <h1>Для перехода по ссылке необходимо ввести пароль</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="password">Введите пароль</label>
          {setPasswordMutation.isIdle && (
            <input
              type="password"
              placeholder="Ваш пароль"
              {...register("password", {
                required: "Это обязательное поле",
                minLength: {
                  value: 6,
                  message: "Минимальная длина пароля 6 символов",
                },
                maxLength: {
                  value: 32,
                  message: "Максимальная длина пароля 32 символа",
                },
                pattern: {
                  value: /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,32}$/,
                  message:
                    "Пароль должен содержать латинские буквы и как минимум одну цифру",
                },
              })}
            />
          )}
          {setPasswordMutation.isLoading && (
            <input
              type="text"
              value="Загрузка"
              name="password"
              id="password"
              readOnly
            />
          )}
          {errors.password?.message && (
            <p className={styles.errors}>{errors.password?.message}</p>
          )}

          <button type="submit">
            Перейти <BsDoorOpenFill />
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
