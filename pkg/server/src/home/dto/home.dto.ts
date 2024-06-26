import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CheckLinkDto {
  @IsString()
  @MinLength(6)
  token: string;
}

export class MakeSecuredDto {
  @IsString()
  @MinLength(6)
  id: string;

  @IsBoolean()
  secured: boolean;
}

export class GetHomeDto {
  @IsString()
  @MinLength(6)
  homeId: string;
}
