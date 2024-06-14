import { Node } from "reactflow";
import { FlowNodeType } from "../items";

export type NodeData<T extends keyof typeof FlowNodeType> = T extends "IMAGE"
  ? {
      imageUrl: string;
      label?: string;
    }
  : T extends "DEVICE"
  ? {
      value: string;
    }
  : T extends "DOOR"
  ? {}
  : T extends "FLOOR"
  ? {}
  : T extends "LITE"
  ? {
      value: boolean;
    }
  : T extends "WALL"
  ? {}
  : T extends "WINDOW"
  ? {}
  : never;

export type NodeFields<T extends keyof typeof FlowNodeType> = {
  color?: string;
  data: NodeData<T>;
  height: number;
  id: string;
  name: string;
  rotation: number;
  type: T;
  width: number;
  x: number;
  y: number;
};

export type PlaneNode = NodeFields<keyof typeof FlowNodeType>;
export type NodeState = Node<PlaneNode["data"], PlaneNode["type"]>;
