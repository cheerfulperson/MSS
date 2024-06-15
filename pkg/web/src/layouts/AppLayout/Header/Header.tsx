import { ReactNode, useMemo } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Layout, Typography, theme as AntTheme, Select } from "antd";
import { matchPath, useLocation } from "react-router-dom";

import { useUserProfileQuery } from "data_layer/queries/useUserProfileQuery";
import { ChangeLanguageButton } from "../ChangeLanguageButton";
import { useHomeContext } from "context/homeContext";
import { AppRoutes } from "config/router";
import styles from "./Header.module.scss";

const { Header: AntdHeader } = Layout;

interface HeaderProps {
  broken: boolean;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const Header = ({ broken, collapsed, onCollapse }: HeaderProps) => {
  const { pathname } = useLocation();
  const { data } = useUserProfileQuery();
  const { changeFloor, floor, floors } = useHomeContext();

  const middleContent = useMemo<ReactNode>(() => {
    if (matchPath(AppRoutes.dashboard.url, pathname)) {
      return (
        <Select
          className={styles.select}
          onChange={changeFloor}
          options={floors.map((province) => ({ label: province.name, value: province.id }))}
          value={floor?.id}
          variant="filled"
        />
      );
    }
    return null;
  }, [changeFloor, floor?.id, floors, pathname]);

  const {
    token: { colorText },
  } = AntTheme.useToken();

  return (
    <AntdHeader className={styles.header}>
      {broken ? (
        <Button
          icon={
            collapsed ? (
              <MenuUnfoldOutlined
                style={{
                  fontSize: "20px",
                }}
              />
            ) : (
              <MenuFoldOutlined
                style={{
                  fontSize: "20px",
                }}
              />
            )
          }
          onClick={() => onCollapse(!collapsed)}
          style={{
            color: colorText,
          }}
          type="text"
        />
      ) : (
        <div />
      )}
      <Flex className={styles.middleContent}>{middleContent}</Flex>
      <Flex align="center" gap={8}>
        <ChangeLanguageButton onlyIcon />
        <Avatar style={{ backgroundColor: data?.avatarColor || "#fde3cf", color: "#ffffff", cursor: "pointer" }}>
          {data?.fullName.slice(0, 1).toUpperCase()}
        </Avatar>
        {!broken && <Typography.Text className={styles.userName}>{data?.fullName}</Typography.Text>}
      </Flex>
    </AntdHeader>
  );
};
