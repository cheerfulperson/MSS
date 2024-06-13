import { Button, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

import { AuthLoginBody } from "data_layer/mutations/useAuthMutations";
import styles from "./GuestLogin.module.scss";

const { Text, Link } = Typography;

export const GuestLogin = () => {
  const onFinish = (values: AuthLoginBody) => {
    console.log("Received values of form: ", values);
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
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input placeholder="Email" prefix={<MailOutlined />} />
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
          <Input.Password placeholder="Password" prefix={<LockOutlined />} type="password" />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" noStyle valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link href="">
            Forgot password?
          </Link>
        </Form.Item>
        <Form.Item style={{ marginBottom: "0px" }}>
          <Button htmlType="submit" type="primary">
            Log in
          </Button>
          <div>
            <Text>Don't have an account?</Text> <Link href="">Sign up</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
