const API_URL = import.meta.env.VITE_API_URL as string;
const MQTT_BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL as string;
const PROTOCOL_MQTT = import.meta.env.VITE_PROTOCOL_MQTT as string;

if (!API_URL) {
  throw new Error("VITE_API_URL env is not defined");
}

if (!MQTT_BROKER_URL) {
  throw new Error("VITE_MQTT_BROKER_URL env is not defined");
}

export const env = {
  API_URL,
  MQTT_BROKER_URL,
  PROTOCOL_MQTT,
}
