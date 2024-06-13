import { Button, Result } from "antd";
import { ExceptionStatusType } from "antd/es/result";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ErrorTemplate.module.scss";
import { useAuthContext } from "context/authContext";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "config/router";

interface ErrorTemplateProps {
  errorCode: ExceptionStatusType;
}

interface Texts {
  subTitle: string;
  title: string;
}

export const ErrorTemplate = ({ errorCode }: ErrorTemplateProps) => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const { isAuthorized } = useAuthContext();

  const texts = useMemo<Texts>(() => {
    const title = t(`common:page_error_result.${errorCode}.title`);
    const subTitle = t(`common:page_error_result.${errorCode}.message`);

    return {
      title,
      subTitle,
    };
  }, [errorCode, t]);

  return (
    <Result
      className={styles.container}
      extra={
        <Button
          onClick={() => {
            if (isAuthorized) {
              navigate(AppRoutes.overview);
            } else {
              navigate(AppRoutes.auth.logIn);
            }
          }}
          type="primary"
        >
          {t("common:actions.back_home")}
        </Button>
      }
      status={errorCode}
      subTitle={texts.subTitle}
      title={texts.title}
    />
  );
};
