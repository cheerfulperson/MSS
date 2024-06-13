import { IsString, MinLength } from 'class-validator';

export class CheckLinkDto {
  @IsString()
  @MinLength(6)
  token: string;
}

export class GetHomeDto {
  @IsString()
  @MinLength(6)
  homeId: string;
}
