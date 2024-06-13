import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flex } from "antd";

import { AppLogo } from "components/icons";
import { useAuthContext } from "context/authContext";
import styles from "./AuthLayout.module.scss";

export const AuthLayout = () => {
  const { t } = useTranslation(["common"]);
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return <Outlet />;
  }
  return (
    <Flex className={styles.page}>
      <div className={styles.container}>
        <Flex className={styles.head}>
          <AppLogo />
          <h1 className={styles.name}>iHomeMaster</h1>
          <p className={styles.slogan}>{t("common:slogan")}</p>
        </Flex>
        <Outlet />
      </div>
    </Flex>
  );
};
