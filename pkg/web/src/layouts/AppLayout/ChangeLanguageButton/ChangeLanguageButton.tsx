import { ItemType } from "antd/es/menu/interface";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Dropdown, theme } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { languages } from "locales";
import { Language } from "components/icons";
import styles from "./ChangeLanguageButton.module.scss";

interface ChangeLanguageButtonProps {
  onlyIcon?: boolean;
}

export const ChangeLanguageButton = ({ onlyIcon }: ChangeLanguageButtonProps) => {
  const { i18n } = useTranslation();

  const languagesItems = useMemo<ItemType[]>(() => {
    return languages.map((lang) => ({
      key: lang?.key,
      label: (
        <span className={styles.item}>
          {i18n.language.includes(lang.key) ? <CheckOutlined /> : <span />}
          <span>{lang?.label}</span>
        </span>
      ),
    }));
  }, [i18n.language]);

  const {
    token: { colorText },
  } = theme.useToken();

  return (
    <Dropdown
      menu={{
        items: languagesItems,
        onClick: ({ key }) => {
          i18n.changeLanguage(key as string);
        },
      }}
      placement="topRight"
      trigger={["click"]}
    >
      {onlyIcon ? (
        <Button icon={<Language color={colorText} />} type="text" />
      ) : (
        <Button className={styles.menuButton} icon={<Language color={colorText} />} type="text">
          {languages.find(({ key }) => i18n.language.includes(key))?.label}
        </Button>
      )}
    </Dropdown>
  );
};
