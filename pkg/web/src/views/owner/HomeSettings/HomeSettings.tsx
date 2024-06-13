import { CopyField } from "components/CopyField";
import { useHomeContext } from "context/homeContext";
import { useHomeShareLinkQuery } from "data_layer/queries/useHomeShareLinkQuery";
import styles from "./HomeSettings.module.scss";

export const HomeSettings = () => {
  const { homeId } = useHomeContext();
  const { link } = useHomeShareLinkQuery(homeId || "");

  return (
    <div className={styles.settings}>
      <CopyField copyText={link || "-"} />
    </div>
  );
};
