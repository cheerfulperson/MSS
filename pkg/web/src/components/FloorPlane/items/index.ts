import ImageNode from "./ImageNode/ImageNode";
import type { FloorPlaneItemType } from "types/api";
import DeviceNode from "./DeviceNode/DeviceNode";

type TFlowNodeType = {
  [key in FloorPlaneItemType]: key;
}

export const FlowNodeType: TFlowNodeType = {
  DEVICE: "DEVICE",
  IMAGE: "IMAGE",
  DOOR: "DOOR",
  FLOOR: "FLOOR",
  LITE: "LITE",
  WALL: "WALL",
  WINDOW: "WINDOW",
};

export const nodeTypes = {
  [FlowNodeType.DEVICE]: DeviceNode,
  [FlowNodeType.IMAGE]: ImageNode,
  [FlowNodeType.DOOR]: ImageNode,
  [FlowNodeType.FLOOR]: ImageNode,
  [FlowNodeType.LITE]: ImageNode,
  [FlowNodeType.WALL]: ImageNode,
  [FlowNodeType.WINDOW]: ImageNode,
};
