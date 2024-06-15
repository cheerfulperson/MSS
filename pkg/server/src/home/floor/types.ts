import { FloorController } from './floor.controller';

export type GetFloorItemsResponse = Awaited<
  ReturnType<FloorController['getFloorItems']>
>;

export type GetFloorItemsResponseItem = GetFloorItemsResponse['floorItems'][0];

export type GetFloorsResponse = Awaited<
  ReturnType<FloorController['getFloors']>
>;
