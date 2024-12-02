import { requester } from '@/shared/config/axios/requester';
import { apiVersion } from '@/shared/lib/constants/constants';


export const updateBannerCounter = (id: number) => {
  try {
    requester.patch(`${apiVersion}/banners/${id}/`);
  } catch (err) {

  }
};

export const updateMainBannerCounter = (id: number) => {
  try {
    requester.patch(`/${apiVersion}/main_banners/${id}/`);
  } catch (err) {

  }
};
