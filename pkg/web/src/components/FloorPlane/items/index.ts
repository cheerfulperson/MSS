import ImageNode from "./ImageNode/ImageNode";
import type { FloorPlaneItemType } from "../../../../../server/src/types/exported";

export const FlowNodeType: Record<FloorPlaneItemType, FloorPlaneItemType> = {
  DEVICE: "DEVICE",
  IMAGE: "IMAGE",
  DOOR: "DOOR",
  FLOOR: "FLOOR",
  LITE: "LITE",
  WALL: "WALL",
  WINDOW: "WINDOW",
};

export const nodeTypes = {
  [FlowNodeType.DEVICE]: ImageNode,
  [FlowNodeType.IMAGE]: ImageNode,
  [FlowNodeType.DOOR]: ImageNode,
  [FlowNodeType.FLOOR]: ImageNode,
  [FlowNodeType.LITE]: ImageNode,
  [FlowNodeType.WALL]: ImageNode,
  [FlowNodeType.WINDOW]: ImageNode,
};
