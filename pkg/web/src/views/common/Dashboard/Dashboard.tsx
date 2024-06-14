import { Flex } from "antd";

import { FloorPlane } from "components/FloorPlane";
import styles from "./Dashboard.module.scss";

export const Dashboard = () => {
  return (
    <Flex className={styles.dashboard}>
      <FloorPlane
        nodes={[
          {
            type: "IMAGE",
            data: {
              imageUrl: "https://via.placeholder.com/150",
              label: "Image",
            },
            height: 200,
            id: "1",
            name: "Image",
            rotation: 0,
            width: 100,
            x: 0,
            y: 0,
          },
        ]}
      />
    </Flex>
  );
};
