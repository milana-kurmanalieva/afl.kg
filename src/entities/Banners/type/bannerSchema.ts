import { Error, REQUEST_STATUSES } from '@/shared/lib/constants/constants';


export interface Banner {
  id: number;
  link: string;
  banner: string;
  mob_banner: string | null;
  title: string;
}

export interface BannerState {
  banners: Banner[],
  bannersError: Error,
  bannersStatus: REQUEST_STATUSES,

  activeBanner: { banner: null | Banner, index: number },

  mainBanners: Banner[],
  mainBannersError: Error,
  mainBannersStatus: REQUEST_STATUSES,

  activeMainBanner: { banner: null | Banner, index: number },
}
