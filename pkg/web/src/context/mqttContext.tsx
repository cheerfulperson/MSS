import { useEffect, useRef } from "react";
import { createContainer } from "unstated-next";
import mqtt, { MqttProtocol } from "mqtt";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { env } from "config/env";
import { useHomeContext } from "./homeContext";
import { UpdateDeviceValueResponse } from "types/api";
import { useUpdateFloorItemsCache } from "data_layer/cache/useUpdateFloorItemsCache";

const useMqtt = () => {
  const { t } = useTranslation(["toast"]);
  const mqttRef = useRef<mqtt.MqttClient | null>(null);
  const { floor, home } = useHomeContext();
  const { updateFloorItemsCache, updateFloorItemsManyCache } = useUpdateFloorItemsCache({
    homeId: home?.id || "",
    floorId: floor?.id || "",
  });

  useEffect(() => {
    if (home && floor) {
      if (mqttRef.current) {
        mqttRef.current.end();
      }
      mqttRef.current = mqtt.connect(env.MQTT_BROKER_URL, {
        protocol: env.PROTOCOL_MQTT as MqttProtocol || "ws",
      });

      mqttRef.current.on("connect", () => {
        toast.success(t("toast:successfully_connected_to", { to: home.name }));
        mqttRef.current?.subscribe("clientDevicesData", () => {});
      });

      mqttRef.current.on("message", (topic, message) => {
        if (topic === "clientDevicesData") {
          const data: UpdateDeviceValueResponse["updatedValue"] | UpdateDeviceValueResponse["updatedValue"][] =
            JSON.parse(message.toString());
          if (Array.isArray(data)) {
            updateFloorItemsManyCache(data);
          } else {
            updateFloorItemsCache(data);
          }
        }
      });

      // return () => {
      //   mqttRef.current?.end();
      //   mqttRef.current = null;
      // };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFloorItemsCache]);
};

const MqttContainer = createContainer(useMqtt);

export const useMqttContext = MqttContainer.useContainer;
export const MqttProvider = MqttContainer.Provider;
