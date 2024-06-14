import React, { memo } from "react";
import { NodeProps } from "reactflow";

import { NodeData } from "../../types/items";
import styles from "./ImageNode.module.scss";

const ImageNode = ({ data }: NodeProps<NodeData<"IMAGE">>) => {
  return (
    <div>
      <img alt={data.label || ""} className={styles.image} src={data.imageUrl} />
    </div>
  );
};

export default memo(ImageNode);
