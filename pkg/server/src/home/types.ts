import { CheckLinkDto } from './dto/home.dto';
import { HomeController } from './home.controller';

export * from './floor/types';

export type CheckHomeLinkBody = CheckLinkDto;
export type CheckHomeLinkResponse = Awaited<
  ReturnType<HomeController['checkHomeLink']>
>;

export type GetHomeResponse = Awaited<ReturnType<HomeController['getHome']>>;

export type GetHomeLinkResponse = Awaited<
  ReturnType<HomeController['getHomeLink']>
>;
