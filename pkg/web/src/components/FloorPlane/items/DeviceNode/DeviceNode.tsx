import React, { memo } from "react";
import * as Images from "react-bootstrap-icons";
import { NodeProps } from "reactflow";

import { NodeData } from "../../types/items";
import styles from "./DeviceNode.module.scss";

const DeviceNode = ({ data }: NodeProps<NodeData<"DEVICE">>) => {
  const Icon = Images[data.icon as keyof typeof Images];
  return (
    <div className={styles.deviceNode}>
      <div
        className={styles.value}
        style={{
          color: data.iconColor,
        }}
      >
        {data.displayValue}
      </div>
      <div className={styles.icon}>
        <Icon
          style={{
            color: data.iconColor,
            width: 42,
            height: 42,
          }}
        />
      </div>
    </div>
  );
};

export default memo(DeviceNode);
