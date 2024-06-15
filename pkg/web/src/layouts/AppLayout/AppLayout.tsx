import { Button, Flex, Layout, Menu, Switch, theme as antdTheme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ApartmentOutlined,
  HomeFilled,
  MergeOutlined,
  BlockOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ItemType } from "antd/es/menu/interface";

import { useAuthContext } from "context/authContext";
import { AppLogo, Moon, Sun } from "components/icons";
import { useThemeContext } from "context/themeContext";
import { AppRoutes } from "config/router";
import { useHomeContext } from "context/homeContext";
import { UserRoles } from "types/user";
import { Header } from "./Header";
import { ChangeLanguageButton } from "./ChangeLanguageButton";
import styles from "./AppLayout.module.scss";

const { Content, Sider } = Layout;

export const AppLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { changeTheme, theme } = useThemeContext();
  const { t } = useTranslation(["app_layout", "common"]);
  const { isAuthorized, logout, session } = useAuthContext();
  const { availableHomes, changeHome, home, homeId } = useHomeContext();

  const [broken, setBroken] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorText },
  } = antdTheme.useToken();

  const menuItems = useMemo(() => {
    const items: ItemType[] = [
      {
        key: homeId || "",
        icon: <HomeFilled />,
        label: home?.name || t("app_layout:menu_items.main"),
      },
      {
        key: "home",
        icon: <BlockOutlined />,
        label: t("app_layout:menu_items.change_house"),
        type: "submenu",
        children: availableHomes
          ?.map<ItemType>((h) => ({
            key: `home_${h.id}`,
            label: h.name,
          }))
          .concat(
            session.role === UserRoles.OWNER
              ? [{ key: AppRoutes.onboarding, label: t("common:actions.add_house"), icon: <PlusOutlined /> }]
              : []
          ),
      },
      {
        key: AppRoutes.devices,
        icon: <ApartmentOutlined />,
        label: t("app_layout:menu_items.devices"),
      },
    ];

    if (session.role === UserRoles.OWNER) {
      items.push(
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
        }
      );
    }
    return items;
  }, [availableHomes, home?.name, homeId, session.role, t]);

  const activeItem =
    menuItems.find((item) => item?.key && pathname.includes(item.key.toString()))?.key?.toString() ||
    menuItems[0]!.key!.toString();

  const handleMenuSelect = useCallback(
    (item: { key: string }) => {
      const isRoute = Object.values(AppRoutes).some((route) =>
        typeof route === "string" ? route === item.key : route.url === item.key
      );
      if (isRoute) {
        return navigate(item.key);
      }
      if (item.key.includes("home_") || item.key === homeId) {
        return changeHome(item.key.replace("home_", ""));
      }
    },
    [changeHome, homeId, navigate]
  );

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
        <div className={styles.siderMenus}>
          <Menu
            defaultSelectedKeys={[activeItem]}
            items={menuItems}
            mode="inline"
            onSelect={handleMenuSelect}
            theme={theme}
          />
          {!collapsed && (
            <Flex className={styles.bottomSiderMenu}>
              <Switch
                checkedChildren={<Sun height={22} width={22} />}
                className={styles.menuSwitch}
                onChange={(v) => {
                  changeTheme(v ? "light" : "dark");
                }}
                unCheckedChildren={<Moon height={14} width={14} />}
                value={theme === "light"}
              />
              <ChangeLanguageButton />
              <Button
                className={styles.menuButton}
                icon={<LogoutOutlined color={colorText} style={{ width: 18, height: 18 }} />}
                onClick={logout}
                type="text"
              >
                {t("common:actions.logout")}
              </Button>
            </Flex>
          )}
        </div>
      </Sider>
      <Layout>
        <Header broken={broken} collapsed={collapsed} onCollapse={setCollapsed} />
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
