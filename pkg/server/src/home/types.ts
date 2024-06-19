import { CheckLinkDto, MakeSecuredDto } from './dto/home.dto';
import { HomeController } from './home.controller';

export * from './floor/types';
export * from './device/types';

export type CheckHomeLinkBody = CheckLinkDto;
export type CheckHomeLinkResponse = Awaited<
  ReturnType<HomeController['checkHomeLink']>
>;

export type MakeHomeSecuredBody = MakeSecuredDto;
export type MakeHomeSecuredResponse = Awaited<
  ReturnType<HomeController['makeSecured']>
>;

export type GetHomeResponse = Awaited<ReturnType<HomeController['getHome']>>;

export type GetHomeLinkResponse = Awaited<
  ReturnType<HomeController['getHomeLink']>
>;
