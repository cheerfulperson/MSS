import { useEffect, useRef } from "react";
import { createContainer } from "unstated-next";
import mqtt from "mqtt";
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
  const { updateFloorItemsCache } = useUpdateFloorItemsCache({ homeId: home?.id || "", floorId: floor?.id || "" });

  useEffect(() => {
    if (home) {
      if (mqttRef.current) {
        mqttRef.current.end();
      }
      mqttRef.current = mqtt.connect(env.MQTT_BROKER_URL);

      mqttRef.current.on("connect", () => {
        toast.success(t("toast:successfully_connected_to", { to: home.name }));
      });

      mqttRef.current.on("message", (topic, message) => {
        if (topic === "client/devices/data") {
          const data: UpdateDeviceValueResponse["updatedValue"] = JSON.parse(message.toString());
          updateFloorItemsCache(data);
        }
      });

      return () => {
        mqttRef.current?.end();
        mqttRef.current = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);
};

const MqttContainer = createContainer(useMqtt);

export const useMqttContext = MqttContainer.useContainer;
export const MattProvider = MqttContainer.Provider;
