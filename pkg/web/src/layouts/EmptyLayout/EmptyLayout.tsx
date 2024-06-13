import { ReactNode } from "react";

import styles from "./EmptyLayout.module.scss";
import { Flex } from "antd";

interface EmptyLayoutProps {
  children: ReactNode;
}

export const EmptyLayout = ({ children }: EmptyLayoutProps) => {
  return <Flex className={styles.emptyLayout}>{children}</Flex>;
};
