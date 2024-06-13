import { Button, Dropdown, Layout, Menu, Switch, theme as antdTheme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ApartmentOutlined,
  CheckOutlined,
  HomeFilled,
  MergeOutlined,
  BlockOutlined,
  SettingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ItemType } from "antd/es/menu/interface";

import { useAuthContext } from "context/authContext";
import { AppLogo, Language, Moon, Sun } from "components/icons";
import { languages } from "locales";
import { useThemeContext } from "context/themeContext";
import { AppRoutes } from "config/router";
import { useHomeContext } from "context/homeContext";
import styles from "./AppLayout.module.scss";

const { Content, Header, Sider } = Layout;

export const AppLayout = () => {
  const { pathname } = useLocation();
  const { changeTheme, theme } = useThemeContext();
  const { i18n, t } = useTranslation(["app_layout", "common"]);
  const { isAuthorized } = useAuthContext();
  const { availableHomes, home, homeId } = useHomeContext();

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

  const menuItems = useMemo<ItemType[]>(() => {
    return [
      {
        key: AppRoutes.dashboard.get(homeId || ""),
        icon: <HomeFilled />,
        label: home?.name || t("app_layout:menu_items.main"),
      },
      {
        key: "home",
        icon: <BlockOutlined />,
        label: t("app_layout:menu_items.change_house"),
        type: "submenu",
        children: availableHomes
          ?.map((h) => ({
            key: AppRoutes.dashboard.get(h.id),
            label: h.name,
          }))
          .concat([{ key: "add_home", label: t("common:actions.add_house") }]),
      },
      {
        key: AppRoutes.devices,
        icon: <ApartmentOutlined />,
        label: t("app_layout:menu_items.devices"),
      },
      {
        key: AppRoutes.algorithms,
        icon: <MergeOutlined />,
        label: t("app_layout:menu_items.algorithms"),
      },
      {
        key: AppRoutes.homeSettings,
        icon: <SettingOutlined />,
        label: t("app_layout:menu_items.settings"),
      },
      {
        key: AppRoutes.planeEditor,
        icon: <EditOutlined />,
        label: t("app_layout:menu_items.plan_editor"),
      },
    ];
  }, [availableHomes, home?.name, homeId, t]);

  const activeItem =
    menuItems.find((item) => item?.key && pathname.includes(item.key.toString()))?.key?.toString() ||
    menuItems[0]!.key!.toString();

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
        <Menu defaultSelectedKeys={[activeItem]} items={menuItems} mode="inline" theme={theme} />
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
