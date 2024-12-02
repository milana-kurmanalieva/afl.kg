import React, { ChangeEvent, FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { HTag } from '@/shared/ui/HTag/HTag';
import {
  AlertVariants,
  BUTTON_VARIANTS,
  PATHS, ShopAction,
  ShopAddress, ShopData,
  ShopDelivery,
} from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import initialPhoto from '@/icons/photo.svg';
import closeIcon from '@/icons/closeDark.svg';
import { Input } from '@/shared/ui/Input/Input';
import { AddButton } from '@/shared/ui/AddButton/AddButton';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Button } from '@/shared/ui/Button/Button';
import { customAlert } from '@/shared/ui/CustomAlert/CustomAlert';
import { RequiredMark } from '@/shared/ui/RequiredMark/RequiredMark';
import { Modal } from '@/shared/ui/Modal/Modal';
import {
  createShop, createShopLogo, deleteMySHop,
  getMyShop, getMyShops, selectMyShop, updateShop,
} from '../../model/myShopsSlice';
import classes from './createShop.module.scss';
import { ShopAddressFields } from './ShopAddressFields';


interface Props {
  action?: ShopAction;
}

interface ShopActionError {
  title: string;
  description: string;
  logo: string;
  addresses: Record<keyof ShopAddress, string>[];
}

const SHOP_ADDRESS_TEMPLATE = { main_number: '+996', secondary_number: '+996', address: '', link_2gis: '' };
const INITIAL_PREVIEW_IMAGE = { preview: null, file: null };
const MAX_SHOP_DESCRIPTION_LENGTH = 3000;
const MAX_SHOP_TITLE_LENGTH = 30;

export const CreateEditShop: FC<Props> = ({ action = ShopAction.Create }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const shop_id = router.query.shop_id as string;

  const DELIVERY_OPTIONS = [
    { title: t(ShopDelivery.Free), value: ShopDelivery.Free, id: 1 },
    { title: t(ShopDelivery.Paid), value: ShopDelivery.Paid, id: 2 },
    { title: t(ShopDelivery.No), value: ShopDelivery.No, id: 3 },
  ];

  const INITIAL_SHOP_DATA = {
    title: '',
    description: '',
    delivery: ShopDelivery.Free,
    addresses: [ SHOP_ADDRESS_TEMPLATE ],
  };

  const { myShop } = useAppSelector(selectMyShop);

  const [ shopData, setShopData ] = useState<ShopData>(INITIAL_SHOP_DATA as ShopData);
  const [ previewImage, setPreviewImage ] =
    useState<{preview: string | null; file: File | null}>(INITIAL_PREVIEW_IMAGE);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState<ShopActionError>({} as ShopActionError);
  const [ isPreview, setIsPreview ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const handleSetShopData = (key: keyof ShopData, value: string | File | ShopDelivery | ShopAddress[] | null) => {
    setShopData(prev => ({ ...prev, [ key ]: value }));
  };

  const handleSetShopError = (res: any) => {
    const error: ShopActionError = res.response.data;

    for (const key in error) {
      setError((prev: any) => {
        let value: any = error[ key as keyof ShopActionError ];
        if (key === 'addresses' && Array.isArray(value)) {
          value = value.map((item: any) => {
            const addressError = { ...item };
            for (const k in item) {
              addressError[ k ] = item[ k ][ 0 ];
            }
            return addressError;
          });
        }
        if (key !== 'addresses' && Array.isArray(value)) {
          value = value[ 0 ];
        }
        return { ...prev, [ key ]: value };
      });
    }
  };

  const handleCloseWindow = async () => {
    await router.push(PATHS.profileShops);
    customAlert(AlertVariants.success,
      t(action === ShopAction.Create ? 'dataSuccessfullySaved' : 'changedSuccessfully'), 5000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (!previewImage.preview) {
      setError((prev: any) => {
        if (prev) return { ...prev, logo: t('uploadAtLeastOnePhoto') as string };
        return { logo: t('uploadAtLeastOnePhoto') as string };
      });
      return;
    }

    setIsLoading(true);

    const addresses = shopData?.addresses?.map(item => {
      if (item.secondary_number === '+996') return { ...item, secondary_number: undefined };
      return item;
    });

    const payload = { ...shopData, addresses };

    let res: any;

    if (action === ShopAction.Create) res = await dispatch(createShop(payload)).unwrap();
    else res = await dispatch(updateShop({ shop_id, data: payload })).unwrap();

    if (res?.response?.status >= 400) {
      handleSetShopError(res);
      setIsLoading(false);
      return;
    }

    if (previewImage.preview && previewImage.file) {
      await dispatch(createShopLogo({ shop_uuid: res.id, logo: previewImage.file as File }));
    }

    setIsLoading(false);

    if (action === ShopAction.Edit) return handleCloseWindow();
    setIsModalOpen(true);

    if (action === ShopAction.Create) {
      if (!isPreview) {
        return setIsPreview(true);
      }
      else setIsPreview(false);
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[ 0 ];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target) return;
      setPreviewImage({ preview: event.target.result as string, file });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteStore = async () => {
    if (action === ShopAction.Create) {
      setShopData(INITIAL_SHOP_DATA);
      return;
    }
    await dispatch(deleteMySHop({ shop_id: shop_id }));
    await dispatch(getMyShops({ limit: 20 }));
    router.push(PATHS.profileShops);
  };

  useEffect(() => {
    if (action === ShopAction.Edit && shop_id) {
      dispatch(getMyShop({ shop_id: shop_id }));
    }
  }, [ action, shop_id ]);

  useEffect(() => {
    if (myShop) {
      for (const key in myShop) {
        if (key === 'store_logo' && myShop?.store_logo?.logo) {
          setPreviewImage((prev) => ({ ...prev, preview: myShop.store_logo.logo }));
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // this is important part, we need to check on undefined
        if (shopData[ key ] !== undefined) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          handleSetShopData(key, myShop[ key ]);
        }
      }
    }
  }, [ myShop ]);

  useEffect(() => {
    setPreviewImage(INITIAL_PREVIEW_IMAGE);
    setShopData(INITIAL_SHOP_DATA as ShopData);
  }, []);

  useEffect(() => {
    setError({} as ShopActionError);
  }, [ shopData, previewImage ]);

  return (
    <form className={`${classes.form} ${isPreview ? classes.preview : ''}`} onSubmit={handleSubmit}>
      <HTag level={4}>{t('shopSettings')}</HTag>
      <p className={classes.caption}>
        {isPreview ? t('checkShopData') : action === ShopAction.Edit ? t('editShopData') : t('createShopData')}
      </p>

      <div className={classes.data}>
        <div>
          <p className={`${isPreview ? classes.caption : ''} ${classes.textareaLabel}`}>
            {t('addAPhoto')}{!isPreview && <RequiredMark/>}
          </p>
          <div className={classes.image}>
            <input
              className={classes.fileInput}
              onClick={(e: any) => e.target.value = null}
              onChange={handlePhotoChange}
              type='file'
              id='shopLogo'
            />
            {!isPreview && previewImage.preview && <img
              onClick={() => setPreviewImage(INITIAL_PREVIEW_IMAGE)}
              className={ classes.deletePhoto}
              src={closeIcon.src} alt="close"
            />}
            <label htmlFor='shopLogo' className={classes.fileLabel}>
              <img
                className={previewImage.preview ? classes.selectedPhoto : classes.emptyPhoto}
                src={previewImage.preview ?? initialPhoto.src}
                alt='photo'
              />
              <p>{t('add')}</p>
            </label>
          </div>
          {!!error.logo && <p className={`${classes.error} ${classes.errorLogo}`}>{error.logo}</p>}
        </div>

        <div>
          <Input
            maxLength={MAX_SHOP_TITLE_LENGTH}
            value={shopData.title}
            onChange={(e) => {
              handleSetShopData('title', e.target.value);
            }}
            label={
              <p className={isPreview ? classes.caption : ''}>
                {t('shopName')}{!isPreview && <RequiredMark/>}
              </p>
            }
            isError={!!error.title}
          />
          {!!error.title && <p className={classes.error}>{error.title}</p>}
        </div>

        {isPreview && !shopData.description ? null : <div>
          <p className={`${isPreview ? classes.caption : ''} ${classes.textareaLabel}`}>{t('description')}</p>
          <textarea
            className={classes.descriptionArea}
            value={shopData.description}
            onChange={(e) => {
              const { value } = e.target;
              if (value.length > MAX_SHOP_DESCRIPTION_LENGTH) return;
              handleSetShopData('description', value);
            }}
          />
          {!isPreview && <p className={classes.charCounter}>
            {shopData.description.length}/{MAX_SHOP_DESCRIPTION_LENGTH}
          </p>}
        </div>}

        <div>
          <div className={classes.addresses}>
            {shopData?.addresses?.map((item, index, array) => (
              <ShopAddressFields
                //We cannot pass properties from item for key, because it will recreate input in DOM, so only index left
                key={index}
                addressItem={item}
                addresses={array}
                index={index}
                setShopData={handleSetShopData}
                error={error.addresses?.[ index ]}
                isPreview={isPreview}
              />
            ))}
          </div>
          {!isPreview && <AddButton onClick={() => {
            if (shopData.addresses) {
              handleSetShopData('addresses', shopData.addresses.concat(SHOP_ADDRESS_TEMPLATE));
            }
          }} className={classes.addShopAddress}>{t('addShopAddress')}</AddButton>}
        </div>

        <div className={classes.selectDelivery}>
          <p className={`${isPreview ? classes.caption : ''} ${classes.textareaLabel}`}>{t('delivery')}</p>
          <FIlterSelect
            secondary
            options={DELIVERY_OPTIONS}
            label={t(shopData.delivery as string)}
            changeOption={(newOption) => {
              if (newOption.value) handleSetShopData('delivery', newOption.value);
            }}
          />
        </div>

        <div className={classes.buttons}>
          <Button className={classes.saveData}>{t('saveData')}</Button>
          {isPreview && <Button
            type='button'
            disabled={isLoading}
            variant={BUTTON_VARIANTS.OUTLINED}
            className={classes.editCreation}
            onClick={() => {
              setIsPreview(false);
            }}>{t('changeData')}
          </Button>}
          {!isPreview && <Button
            onClick={handleDeleteStore}
            type='button'
            variant={BUTTON_VARIANTS.DELETE}
            disabled={isLoading}
            className={classes.deleteButton}
          >{t('deleteData')}</Button>}
        </div>
      </div>

      <Modal
        className={classes.modal}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={<p className={classes.modalTitle}>{t('onAdminModeration')}</p>}
        onClose={handleCloseWindow}
        closeButton
      >
        <Button onClick={handleCloseWindow} className={classes.closeBtn}>{t('close')}</Button>
      </Modal>
    </form>
  );
};
