import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillLock, AiFillSave, AiOutlineClose } from "react-icons/ai";
import ILink from "../../interfaces/link";
import { setPasswordOnLink, SetPasswordOnLinkData } from "../../services/link";
import styles from "./PasswordProtectedLinkForm.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            ? "Пароль успешно добавлен!"
            : watchPass1 === undefined || ""
            ? "Пароль успешно удален!"
            : "Пароль успешно изменен!",
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
        setError("oldPass", { type: "custom", message: "Неверный пароль!" });
        setPasswordMutation.reset();
      },
    }
  );

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setPasswordMutation.mutate({
      shortLink: link.shortLink,
      oldPassword: data?.oldPass ?? "",
      password: data.pass2,
    });
  };

  return (
    <div className={styles.wrapper}>
      {addingPasswordState ? (
        <>
          {setPasswordMutation.isLoading && <p>Загрузка...</p>}
          {setPasswordMutation.isIdle && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {link.password !== "" && (
                <>
                  <label htmlFor="oldPass">Введите старый пароль</label>
                  <input
                    type="password"
                    placeholder="Ваш старый пароль"
                    {...register("oldPass", {
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
                  {errors.oldPass?.message && (
                    <p className={styles.errors}>{errors.oldPass?.message}</p>
                  )}
                </>
              )}

              <label htmlFor="pass1">
                Введите новый пароль
                {link.password !== "" &&
                  " (Для удаления пароля оставьте пустым)"}
              </label>
              <input
                type="password"
                placeholder="Ваш новый пароль"
                {...register("pass1", {
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
              {errors.pass1?.message && (
                <p className={styles.errors}>{errors.pass1?.message}</p>
              )}

              <label htmlFor="pass2">
                Подтвердите ваш пароль
                {link.password !== "" &&
                  " (Для удаления пароля оставьте пустым)"}
              </label>
              <input
                type="password"
                placeholder="Подтвердите ваш пароль"
                {...register("pass2", {
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
                  validate: (password) =>
                    password !== (watchPass1 ?? "")
                      ? "Пароли должны совпадать!"
                      : true,
                })}
              />
              {errors.pass2?.message && (
                <p className={styles.errors}>{errors.pass2?.message}</p>
              )}
              <div>
                <button type="submit">
                  Сохранить <AiFillSave />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingPasswordState(false);
                    reset();
                  }}
                >
                  Отмена <AiOutlineClose />
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <button type="button" onClick={() => setAddingPasswordState(true)}>
          {link.password === ""
            ? "Добавить пароль на ссылку"
            : "Изменить/Удалить пароль на ссылку"}{" "}
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
