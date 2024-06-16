import { IsBoolean, IsString, MinLength } from 'class-validator';

export class UpdateDeviceValueDto {
  @IsString()
  @MinLength(6)
  deviceId: string;

  @IsString()
  @MinLength(6)
  deviceValueId: string;

  @IsBoolean()
  value: boolean;
}
