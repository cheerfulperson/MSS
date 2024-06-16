import { DeviceController } from './device.controller';
import { UpdateDeviceValueDto } from './dto/device.dto';

export type UpdateDeviceValueResponse = Awaited<
  ReturnType<DeviceController['updateDeviceValue']>
>;

export type UpdateDeviceValueBody = UpdateDeviceValueDto;
