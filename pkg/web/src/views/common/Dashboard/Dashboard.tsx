import { useCallback, useRef, useState } from "react";
import { Button, Flex, Modal, Progress, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { FloorPlane } from "components/FloorPlane";
import { useHomeContext } from "context/homeContext";
import { useFloorItemsQuery } from "data_layer/queries/useFloorItemsQuery";
import { NodeFields, ValueType } from "components/FloorPlane/types";
import { FlowNodeType } from "components/FloorPlane/items";
import { AppLoader } from "components/AppLoader";
import { useUpdateValueMutation } from "data_layer/mutations/useUpdateValueMutation";
import styles from "./Dashboard.module.scss";

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation(["common", "enums", "toast"]);
  const { floor, homeId, isFloorsLoading } = useHomeContext();
  const { isLoading, updateValue } = useUpdateValueMutation({ floorId: floor?.id || "", homeId: homeId || "" });
  const { floorDevices, floorImages } = useFloorItemsQuery({ homeId: homeId || "", floorId: floor?.id || "" });

  const [disabled, setDisabled] = useState(false);
  const [selectedNode, setSelectedNode] = useState<(typeof floorDevices)[0] | null>(null);
  const device = selectedNode?.Device;
  const deviceValue = device?.DeviceValues[0];
  const deviceValueSetup = deviceValue?.DeviceValueSetup;
  const parsedValue = parseValue(deviceValueSetup?.valueType || "STRING", deviceValue?.value || "");

  const {
    token: { green6, red6 },
  } = theme.useToken();

  const handleClose = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleChangeValue = useCallback(() => {
    if (isLoading || disabled) return;

    if (device?.deviceType === "SWITCH") {
      setDisabled(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setDisabled(false);
      }, 3000);
    }

    if (device) {
      updateValue(
        {
          deviceId: device.id,
          deviceValueId: deviceValue?.id || "",
          value: deviceValue?.value === "true" ? false : true,
        },
        {
          onSuccess(data) {
            toast.success(t("toast:success_updated"));
            setSelectedNode((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                Device: {
                  ...prev.Device!,
                  DeviceValues: [
                    {
                      ...prev.Device!.DeviceValues[0]!,
                      value: data.updatedValue.value,
                      treatLevel: data.updatedValue.treatLevel,
                    },
                  ],
                },
              };
            });
          },
        }
      );
    }
  }, [device, deviceValue?.id, deviceValue?.value, disabled, isLoading, t, updateValue]);

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
      data: {
        displayValue: item.Device?.connected ? `${displayValue} ${valueSetup.measure || ""}` : "",
        icon: item.Device!.icon || "Hdd",
        iconColor: !item.Device?.connected
          ? "var(--ant-color-text-tertiary"
          : valueSetup.valueType === ValueType.BOOLEAN
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
      {isFloorsLoading && !nodes.length ? (
        <AppLoader />
      ) : (
        <FloorPlane
          nodes={nodes}
          onNodeClick={(node) => {
            const device = floorDevices.find((n) => n.id === node.id);
            if (device) {
              setSelectedNode(device);
            }
          }}
        />
      )}
      <Modal
        classNames={{
          content: styles.modalContent,
        }}
        footer={null}
        onCancel={handleClose}
        open={!!selectedNode}
        title={`${t("common:device")}: ${selectedNode?.Device?.name}`}
      >
        <div className={styles.modalBody}>
          <div className={styles.infoList}>
            <Typography.Text strong>{t("common:device_kind")}:</Typography.Text>
            <Typography.Text>
              {selectedNode?.Device?.deviceKind ? t(`enums:DeviceKind.${selectedNode.Device.deviceKind}`) : "-"}
            </Typography.Text>

            <Typography.Text strong>{t("common:device_type")}:</Typography.Text>
            <Typography.Text>
              {selectedNode?.Device?.deviceType ? t(`enums:DeviceType.${selectedNode.Device.deviceType}`) : "-"}
            </Typography.Text>

            <Typography.Text strong>{t("common:buttery_level")}:</Typography.Text>
            <Typography.Text>
              <Progress
                format={(percent) => `${percent} %`}
                percent={selectedNode?.Device?.Buttery?.capacity}
                size="small"
                steps={4}
                strokeColor={(selectedNode?.Device?.Buttery?.capacity || 0) > 30 ? green6 : red6}
              />
            </Typography.Text>

            <Typography.Text strong>{t("common:device")}:</Typography.Text>
            <Typography.Text
              style={{
                color: device?.connected ? green6 : red6,
              }}
            >
              {device?.connected ? t("common:connected") : t("common:disconnected")}
            </Typography.Text>

            <Typography.Text strong>{t("common:state")}:</Typography.Text>
            <Typography.Text color={green6}>
              <div className={styles.value}>
                <Typography.Text
                  style={{
                    color:
                      typeof parsedValue === "boolean"
                        ? parsedValue
                          ? deviceValueSetup?.trueInfoColor || green6
                          : deviceValueSetup?.falseInfoColor || red6
                        : green6,
                  }}
                >
                  {typeof parsedValue === "boolean"
                    ? parsedValue
                      ? deviceValueSetup?.trueInfo
                      : deviceValueSetup?.falseInfo
                    : `${parsedValue} ${deviceValueSetup?.measure || ""}`}
                </Typography.Text>
              </div>
            </Typography.Text>
          </div>
          {device?.deviceKind === "ACTUATOR" && (
            <Button
              className={styles.actionButton}
              disabled={disabled}
              htmlType="button"
              loading={isLoading || disabled}
              onClick={handleChangeValue}
              type="primary"
            >
              {t("common:actions.change_state_to", {
                state:
                  typeof parsedValue === "boolean"
                    ? parsedValue
                      ? deviceValueSetup?.falseInfo
                      : deviceValueSetup?.trueInfo
                    : `${parsedValue} ${deviceValueSetup?.measure || ""}`,
              })}
            </Button>
          )}
        </div>
      </Modal>
    </Flex>
  );
};
