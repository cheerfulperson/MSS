import { Button, Dropdown, Layout, Menu, Switch, theme as antdTheme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ItemType } from "antd/es/menu/interface";

import { useAuthContext } from "context/authContext";
import { AppLogo, Language, Moon, Sun } from "components/icons";
import { languages } from "locales";
import { useThemeContext } from "context/themeContext";
import styles from "./AppLayout.module.scss";

const { Content, Header, Sider } = Layout;

export const AppLayout = () => {
  const { changeTheme, theme } = useThemeContext();
  const { i18n } = useTranslation();
  const { isAuthorized } = useAuthContext();
  const [broken, setBroken] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorText },
  } = antdTheme.useToken();

  const languagesItems = useMemo<ItemType[]>(() => {
    return languages.map((lang) => ({
      key: lang?.key,
      label: (
        <span className={styles.item}>
          {i18n.language === lang.key ? <CheckOutlined /> : <span />}
          <span>{lang?.label}</span>
        </span>
      ),
    }));
  }, [i18n.language]);

  if (!isAuthorized) {
    return <Outlet />;
  }

  return (
    <Layout className={styles.layout}>
      <div
        className={classNames(styles.underground, {
          [styles.underground__visible]: broken && !collapsed,
        })}
        onClick={() => setCollapsed(true)}
      />
      <Sider
        breakpoint="md"
        className={classNames({
          [styles.sider]: broken,
        })}
        collapsed={collapsed}
        collapsedWidth={broken ? "0" : "64"}
        collapsible
        onBreakpoint={(broken) => {
          setBroken(broken);
        }}
        theme={theme}
        trigger={null}
      >
        <div
          className={classNames(styles.siderActions, {
            [styles.siderActions__collapsed]: collapsed,
          })}
        >
          {!collapsed && <AppLogo height={32} width={32} />}
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
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: colorText,
            }}
            type="text"
          />
        </div>
        <Menu
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
          mode="inline"
          theme={theme}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          {broken && (
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
              onClick={() => setCollapsed(!collapsed)}
              style={{
                color: colorText,
              }}
              type="text"
            />
          )}
          <div>
            <Switch
              checkedChildren={<Sun height={22} width={22} />}
              className={styles.switch}
              onChange={(v) => {
                changeTheme(v ? "light" : "dark");
              }}
              unCheckedChildren={<Moon height={14} width={14} />}
              value={theme === "light"}
            />
            <Dropdown
              menu={{
                items: languagesItems,
                onClick: ({ key }) => {
                  i18n.changeLanguage(key as string);
                },
              }}
              trigger={["click"]}
            >
              <Language color={colorText} />
            </Dropdown>
          </div>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
