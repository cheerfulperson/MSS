import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { HomeOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AuthLoginGuestBody } from "data_layer/mutations/useAuthMutations";
import { useLinkMutations } from "data_layer/mutations/useLinkMutations";
import { useQueryParams } from "hooks/useQueryParams";
import { AppLoader } from "components/AppLoader";
import { useZodValidation } from "hooks/useZodValidation";
import { useAuthContext } from "context/authContext";
import { AppRoutes } from "config/router";
import styles from "./GuestLogin.module.scss";

interface State {
  isValidToken: boolean;
  loading: boolean;
}

const useValidation = () => {
  const { t } = useTranslation(["form"]);
  const validation = z.object({
    homeSlug: z
      .string({
        required_error: t("form:errors.required"),
      })
      .min(4, t("form:errors.invalid.home_slug")),
    password: z
      .string({
        required_error: t("form:errors.required"),
      })
      .min(1, t("form:errors.required")),
    name: z
      .string({
        required_error: t("form:errors.required"),
      })
      .min(2, t("form:errors.invalid.name")),
  });

  const [rule] = useZodValidation<z.infer<typeof validation>>(validation);
  return { rules: [rule] };
};

export const GuestLogin = () => {
  const navigate = useNavigate();
  const { loginGuest } = useAuthContext();
  const { t } = useTranslation(["common", "form", "toast"]);

  const [state, setState] = useState<State>({
    isValidToken: false,
    loading: true,
  });

  const { queryParams } = useQueryParams<{ token?: string }>();
  const { checkLink } = useLinkMutations();

  const { rules } = useValidation();
  const onFinish = (values: AuthLoginGuestBody) => {
    loginGuest(
      { ...values, token: queryParams.token },
      {
        onSuccess() {
          navigate(AppRoutes.overview);
        },
        onError() {
          toast.error(t("toast:something_went_wrong"));
        },
      }
    );
  };

  useEffect(() => {
    if (queryParams.token) {
      return checkLink(
        { token: queryParams.token },
        {
          onSuccess() {
            setState((prevState) => ({ ...prevState, loading: false, isValidToken: true }));
          },
          onError() {
            setState((prevState) => ({ ...prevState, loading: false, isValidToken: false }));
          },
        }
      );
    }
    setState((prevState) => ({ ...prevState, loading: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams.token]);

  if (state.loading) {
    return (
      <div className={styles.login}>
        <AppLoader />
      </div>
    );
  }
  return (
    <div className={styles.login}>
      <Form
        className={styles.form}
        initialValues={{}}
        layout="vertical"
        name="normal_login"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item name="name" rules={rules}>
          <Input placeholder={t("form:fields.name")} prefix={<UserOutlined />} size="large" />
        </Form.Item>
        {!state.isValidToken && (
          <>
            <Form.Item name="homeSlug" rules={rules}>
              <Input placeholder={t("form:fields.home_slug")} prefix={<HomeOutlined />} size="large" />
            </Form.Item>
            <Form.Item name="password" rules={rules}>
              <Input.Password
                placeholder={t("form:fields.password")}
                prefix={<LockOutlined />}
                size="large"
                type="password"
              />
            </Form.Item>
          </>
        )}
        <Form.Item style={{ marginBottom: "0px" }}>
          <Button className={styles.button} htmlType="submit" size="large" type="primary">
            {t("common:actions.login")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
