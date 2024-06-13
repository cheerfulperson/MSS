import { ReactNode } from "react";

import styles from "./EmptyLayout.module.scss";

interface EmptyLayoutProps {
  children: ReactNode;
}

export const EmptyLayout = ({ children }: EmptyLayoutProps) => {
  return <div className={styles.emptyLayout}>{children}</div>;
};
