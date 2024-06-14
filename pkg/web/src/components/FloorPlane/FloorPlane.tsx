import { useEffect, useMemo } from "react";
import ReactFlow, { Controls, Background, useNodesState } from "reactflow";
import { nodeTypes } from "./items";
import { NodeState, PlaneNode } from "./types";

import "reactflow/dist/style.css";
import "./reactflow.overwrite.scss";
import styles from "./FloorPlane.module.scss";

interface FloorPlaneProps {
  nodes: PlaneNode[];
}

export const FloorPlane = ({ nodes: defaultNodes }: FloorPlaneProps) => {
  const initialNodes = useMemo(() => {
    const nodes: NodeState[] = defaultNodes.map((n) => {
      const node: NodeState = {
        data: n.data,
        draggable: false,
        height: n.height,
        id: n.id,
        position: { x: n.x, y: n.y },
        selectable: false,
        type: n.type,
        width: n.width,
      };
      return node;
    });
    return nodes;
  }, [defaultNodes]);
  const [nodes, setNodes, onNodesChange] = useNodesState<PlaneNode["data"]>(initialNodes);
  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [],
  // );

  useEffect(() => {
    setNodes(initialNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNodes]);

  return (
    <ReactFlow
      attributionPosition="top-right"
      className={styles.overview}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
      // onConnect={onConnect}
      onNodesChange={onNodesChange}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};
