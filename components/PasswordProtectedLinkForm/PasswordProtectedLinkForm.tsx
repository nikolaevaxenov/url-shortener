import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillLock, AiFillSave, AiOutlineClose } from "react-icons/ai";
import ILink from "../../interfaces/link";
import { setPasswordOnLink, SetPasswordOnLinkData } from "../../services/link";
import styles from "./PasswordProtectedLinkForm.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

type PasswordProtectedLinkFormProps = {
  link: ILink;
};

type FormInput = {
  oldPass?: string;
  pass1: string;
  pass2: string;
};

export default function PasswordProtectedLinkForm({
  link,
}: PasswordProtectedLinkFormProps) {
  const { t } = useTranslation("passwordProtectedLinkForm");
  const { locale } = useRouter();

  const [addingPasswordState, setAddingPasswordState] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormInput>();

  const watchPass1 = watch("pass1");

  useEffect(() => {
    setAddingPasswordState(false);
    reset();
  }, [link, reset]);

  const setPasswordMutation = useMutation(
    (setPasswordData: SetPasswordOnLinkData) =>
      setPasswordOnLink(setPasswordData),
    {
      onSuccess: (data, variables) => {
        setAddingPasswordState(false);

        toast.success(
          variables.oldPassword === ""
            ? t("passwordAddedToast")
            : watchPass1 === undefined || ""
            ? t("passwordDeletedToast")
            : t("passwordEditedToast"),
          {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          }
        );

        link.password = watchPass1 ?? "";
        reset();
        setPasswordMutation.reset();
      },
      onError: () => {
        setError("oldPass", { type: "custom", message: t("wrongPassword") });
        setPasswordMutation.reset();
      },
    }
  );

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setPasswordMutation.mutate({
      shortLink: link.shortLink,
      oldPassword: data?.oldPass ?? "",
      password: data.pass2,
      lang: locale,
    });
  };

  return (
    <div className={styles.wrapper}>
      {addingPasswordState ? (
        <>
          {setPasswordMutation.isLoading && <p>{t("loading")}</p>}
          {setPasswordMutation.isIdle && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {link.password !== "" && (
                <>
                  <label htmlFor="oldPass">{t("form.enterOldPassword")}</label>
                  <input
                    type="password"
                    placeholder={t("form.oldPasswordPlaceholder")}
                    {...register("oldPass", {
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
                  {errors.oldPass?.message && (
                    <p className={styles.errors}>{errors.oldPass?.message}</p>
                  )}
                </>
              )}

              <label htmlFor="pass1">
                {t("form.pass1Label")}
                {link.password !== "" && t("form.forDeletionLeaveBlank")}
              </label>
              <input
                type="password"
                placeholder={t("form.pass1Placeholder")}
                {...register("pass1", {
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
              {errors.pass1?.message && (
                <p className={styles.errors}>{errors.pass1?.message}</p>
              )}

              <label htmlFor="pass2">
                {t("form.pass2Label")}
                {link.password !== "" && t("form.forDeletionLeaveBlank")}
              </label>
              <input
                type="password"
                placeholder={t("form.pass2Placeholder")}
                {...register("pass2", {
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
                  validate: (password) =>
                    password !== (watchPass1 ?? "") ? t("form.validate") : true,
                })}
              />
              {errors.pass2?.message && (
                <p className={styles.errors}>{errors.pass2?.message}</p>
              )}
              <div>
                <button type="submit">
                  {t("form.saveButton")} <AiFillSave />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingPasswordState(false);
                    reset();
                  }}
                >
                  {t("form.cancelButton")} <AiOutlineClose />
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <button type="button" onClick={() => setAddingPasswordState(true)}>
          {link.password === ""
            ? t("addPasswordButton")
            : t("editDeletePasswordButton")}{" "}
          <AiFillLock />
        </button>
      )}
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
    </div>
  );
}
