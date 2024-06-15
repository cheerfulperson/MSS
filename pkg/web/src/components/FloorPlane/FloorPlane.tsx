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
        draggable: n.draggable || false,
        id: n.id,
        position: { x: n.x, y: n.y },
        selectable: n.selectable || false,
        style: {
          width: n.width,
          height: n.height,
        },
        type: n.type,
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

  console.log("nodes", nodes);

  useEffect(() => {
    setNodes(initialNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNodes]);

  return (
    <ReactFlow
      attributionPosition="top-right"
      className={styles.overview}
      fitView
      maxZoom={4}
      minZoom={0.2}
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
