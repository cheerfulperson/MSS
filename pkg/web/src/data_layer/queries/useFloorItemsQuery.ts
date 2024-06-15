import { FlowNodeType } from "components/FloorPlane/items";
import { useQuery } from "data_layer/hooks/useQuery";
import { GetFloorItemsResponse, GetFloorItemsResponseItem } from "types/api";

export const useFloorItemsQuery = ({ floorId, homeId }: { floorId: string; homeId: string }) => {
  const { data, isLoading } = useQuery<GetFloorItemsResponse>(`home/${homeId}/floor/${floorId}/items`, {});

  const floorDevices: Omit<GetFloorItemsResponseItem, "Image">[] = (
    data?.floorItems.filter((item) => item.type === FlowNodeType.DEVICE) || []
  ).map((item) => ({
    id: item.id,
    type: item.type,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    angle: item.angle,
    Device: item.Device,
  }));

  const floorImages: Omit<GetFloorItemsResponseItem, "Device">[] = (
    data?.floorItems.filter((item) => item.type === FlowNodeType.IMAGE) || []
  ).map((item) => ({
    id: item.id,
    type: item.type,
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    angle: item.angle,
    Image: item.Image,
  }));

  return {
    floorDevices,
    floorImages,
    isLoading,
  };
};
