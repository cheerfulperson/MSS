import { Button, Result } from "antd";
import { ExceptionStatusType } from "antd/es/result";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import styles from "./ErrorTemplate.module.scss";

interface ErrorTemplateProps {
  errorCode: ExceptionStatusType;
}

interface Texts {
  title: string;
  subTitle: string;
}

export const ErrorTemplate = ({ errorCode }: ErrorTemplateProps) => {
  const { t } = useTranslation(["common"]);

  const texts = useMemo<Texts>(() => {
    const title = t(`common:page_error_result.${errorCode}.title`);
    const subTitle = t(`common:page_error_result.${errorCode}.message`);

    return {
      title,
      subTitle,
    };
  }, [t]);

  return (
    <Result
    className={styles.container}
      status={errorCode}
      title={texts.title}
      subTitle={texts.subTitle}
      extra={<Button type="primary">{t("common:actions.back_home")}</Button>}
    />
  );
};
