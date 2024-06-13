import { Button, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { AuthLoginBody } from "data_layer/mutations/useAuthMutations";
import { useZodValidation } from "hooks/useZodValidation";
import { AppRoutes } from "config/router";
import { useAuthContext } from "context/authContext";
import styles from "./Login.module.scss";

const { Link, Text } = Typography;

const useValidation = () => {
  const { t } = useTranslation(["form"]);
  const validation = z.object({
    email: z
      .string({
        required_error: t("form:errors.required"),
      })
      .min(1, t("form:errors.required")),
    password: z
      .string({
        required_error: t("form:errors.required"),
      })
      .min(1, t("form:errors.required")),
  });

  const [rule] = useZodValidation<z.infer<typeof validation>>(validation);
  return { rules: [rule] };
};

export const Login = () => {
  const navigate = useNavigate();
  const { rules } = useValidation();
  const { t } = useTranslation(["common", "form"]);
  const { login } = useAuthContext();

  const onFinish = (values: AuthLoginBody) => {
    login(values, {
      onError() {
        toast.error(t("form:errors.invalid_credentials.login"));
      },
      onSuccess() {
        navigate(AppRoutes.overview);
      },
    });
  };

  return (
    <div className={styles.login}>
      <Form
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        name="normal_login"
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Form.Item name="email" rules={rules}>
          <Input
            placeholder={t("form:fields.email")}
            prefix={<MailOutlined style={{ paddingRight: 8 }} />}
            size="large"
            type="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            placeholder={t("form:fields.password")}
            prefix={<LockOutlined style={{ paddingRight: 8 }} />}
            size="large"
            type="password"
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>{t("common:remember_me")}</Checkbox>
        </Form.Item>
        {/* <Link href="">Forgot password?</Link> */}
        <Form.Item style={{ marginBottom: "0px" }}>
          <Button className={styles.button} htmlType="submit" size="large" type="primary">
            {t("common:actions.login")}
          </Button>
          <div className={styles.singupText}>
            <Text>{t("common:do_not_have_account")}</Text>{" "}
            <Link href={AppRoutes.auth.signUp}>{t("common:actions.signup")}</Link>{" "}
            <Text>{t("common:or")}</Text>{" "}
            <Link href={AppRoutes.auth.logInGuest}>{t("common:actions.login_as_guest")}</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
