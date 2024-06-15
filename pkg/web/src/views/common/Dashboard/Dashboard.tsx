import { Flex } from "antd";

import { FloorPlane } from "components/FloorPlane";
import { useHomeContext } from "context/homeContext";
import { useFloorItemsQuery } from "data_layer/queries/useFloorItemsQuery";
import { NodeFields, ValueType } from "components/FloorPlane/types";
import { FlowNodeType } from "components/FloorPlane/items";
import styles from "./Dashboard.module.scss";
import { AppLoader } from "components/AppLoader";

const parseValue = (type: keyof typeof ValueType, value: string) => {
  switch (type) {
    case "BOOLEAN":
      return value === "true";
    case "NUMBER":
      return parseFloat(value);
    case "STRING":
      return value;
  }
};

export const Dashboard = () => {
  const { floor, homeId, isFloorsLoading } = useHomeContext();
  const { floorDevices, floorImages } = useFloorItemsQuery({ homeId: homeId || "", floorId: floor?.id || "" });

  const imageNodes: NodeFields<"IMAGE">[] = floorImages.map((item) => ({
    type: FlowNodeType.IMAGE,
    data: {
      imageUrl: item.Image?.url || "",
    },
    height: item.height,
    id: item.id,
    rotation: item.angle,
    width: item.width,
    x: item.x,
    y: item.y,
  }));

  const deviceNodes: NodeFields<"DEVICE">[] = floorDevices.map((item) => {
    const deviceValue = item.Device!.DeviceValues[0]!;
    const valueSetup = deviceValue.DeviceValueSetup;
    const parsedValue = parseValue(valueSetup.valueType, deviceValue.value);
    let displayValue = parsedValue.toString();
    if (typeof parsedValue === "boolean") {
      displayValue = (parsedValue ? valueSetup.trueInfo : valueSetup.falseInfo) || "";
    }
    return {
      type: FlowNodeType.DEVICE,
      draggable: true,
      selectable: true,
      data: {
        displayValue: `${displayValue} ${valueSetup.measure || ""}`,
        icon: item.Device!.icon || "Hdd",
        iconColor:
          valueSetup.valueType === ValueType.BOOLEAN
            ? deviceValue.value === "true"
              ? valueSetup.trueInfoColor || "var(--ant-color-primary-border-hover)"
              : valueSetup.falseInfoColor || "var(--ant-color-primary-border-hover)"
            : "var(--ant-color-primary-border-hover)",
      },
      height: item.height,
      id: item.id,
      rotation: item.angle,
      width: item.width,
      x: item.x,
      y: item.y,
    };
  });

  const nodes = [...imageNodes, ...deviceNodes];

  return (
    <Flex className={styles.dashboard}>
      {isFloorsLoading && !nodes.length ? <AppLoader /> : <FloorPlane nodes={nodes} />}
    </Flex>
  );
};
