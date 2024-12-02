import React, { ChangeEvent, FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { HTag } from '@/shared/ui/HTag/HTag';
import {
  AlertVariants, BUTTON_VARIANTS, CatOptions,
  FilterSelectOption,
  PATHS,
  ShopAction, ShopAddress, ShopData, ShopDelivery,
} from '@/shared/lib/constants/constants';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import { Input } from '@/shared/ui/Input/Input';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Button } from '@/shared/ui/Button/Button';
import closeIcon from '@/shared/assets/icons/closeDark.svg';
import photoSvg from '@/shared/assets/icons/photo.svg';
import { customAlert } from '@/shared/ui/CustomAlert/CustomAlert';
import { RequiredMark } from '@/shared/ui/RequiredMark/RequiredMark';
import GelleryIcon from '@/shared/assets/icons/gallery.svg';
import {
  createPhoto, createProduct,
  deleteProduct,
  editProduct,
  getCategories, getMyProduct, selectMyProducts,
} from '../../model/myProductsSlice';
import { productRoot } from '../../types/myProductsSchema';
import classes from './createShop.module.scss';


interface Props {
  action?: ShopAction;
}

type ProductData = {
  title: string;
  description: string;
  category: number | null;
  store: string;
  brand: string;
  price: string;
};

const MAX_SHOP_DESCRIPTION_LENGTH = 3000;

export const CreateEditProduct: FC<Props> = ({ action = ShopAction.Create }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const store = router.query.store as string;
  const { categories } = useAppSelector(selectMyProducts);

  const [ shopData, setShopData ] = useState<ProductData>({
    title: '',
    description: '',
    category: 0,
    store: '',
    price: '',
    brand: '',
  });


  const [ isLoading, setIsLoading ] = useState(false);
  const [ photos, setPhotos ] = useState<Array<{image: string; file?: File, id?: number} | null>>([ null ]);
  const [ categoriesOptions, setCategoriesOptions ] = useState<Array<CatOptions>>([]);
  const [ subCategoriesOptions, setSubCategoriesOptions ] = useState<Array<CatOptions>>([]);
  const [ selectedCategory, setSelectedCategory ] = useState<CatOptions | null>(null);
  const [ selectedSubCategory, setSelectedSubCategory ] = useState<CatOptions | null>(null);
  const [ errors, setErrors ] = useState('');
  const [ isPreviewProduct, setIsPreviewProduct ] = useState(false);
  const [ photoLabelShow, setPhotoLabelShow ] = useState(true);

  const handleSetShopData = (
    key: keyof ShopData,
    value: string | File | ShopDelivery | ShopAddress[] | CatOptions | null,
  ) => {
    setShopData(prev => ({ ...prev, [ key ]: value }));
  };

  const product_id = router.query.product_id as string;

  const handleCategoryChange = (option: CatOptions) => {
    setSelectedCategory(option);
    const categoryId = option.id;
    if (categoryId) handleSetShopData('category', categoryId.toString());

    setSubCategoriesOptions(option.children ?? []);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryChange = (newOption: CatOptions) => {
    setSelectedSubCategory(newOption);
    const categoryId = newOption.children ? newOption.id : selectedCategory?.id || '';
    if (categoryId) {
      handleSetShopData('category', categoryId.toString());
    }
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (action === ShopAction.Create) {
      if (!isPreviewProduct) {
        return setIsPreviewProduct(true);
      }
      setIsPreviewProduct(false);
    }

    if (!shopData.brand ||
      !shopData.price || !shopData.category || !shopData.title || photos.length <= 1) {
      customAlert(AlertVariants.error, 'Заполните все поля');
      return;
    }

    try {
      let productResponse;

      const data = {
        title: shopData.title,
        description: shopData.description,
        store: store,
        category: shopData.category,
        price: shopData.price,
        brand: shopData.brand,
      };

      if (action === ShopAction.Create) {
        productResponse = await dispatch(createProduct(data)).unwrap();
      }

      if (action === ShopAction.Edit) {
        productResponse = await dispatch(editProduct({
          data,
          product_id: product_id,
        })).unwrap();
      }

      const productId = productResponse.id;
      await dispatch(createPhoto({
        product_id: productId,
        product_photos: photos.filter(item => item).map(item => item!.file || item!.id) as Array<File | number>,
      }));

      router.push(PATHS.profileShops);
      customAlert(AlertVariants.success,
        t(action === ShopAction.Create ? 'dataSuccessfullySaved' : 'changedSuccessfully'), 5000);

    } catch (error) {
      customAlert(AlertVariants.error, t('somethingWentWrong'), 5000);
    }

  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const fileList = e.target.files;
    if (!fileList) return;

    if (fileList.length + idx > 10) {
      customAlert(AlertVariants.error, 'Вы можете загрузить не более 10 фотографий', 5000);
      return;
    }

    const newPhotos = [ ...photos ];

    const readFile = (file: File, newIndex: number) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result) {
            newPhotos[ newIndex ] = { file, image: event.target.result as string };
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    };

    const promises = Array.from(fileList).map((file, i) => {
      const newIndex = idx + i;
      if (newIndex < 10) {
        return readFile(file, newIndex);
      }
      return Promise.resolve();
    });

    await Promise.all(promises);

    if (newPhotos.filter(photo => photo).length < 10) {
      newPhotos.push(null);
    }

    setPhotos(newPhotos);
    setPhotoLabelShow(true);
  };


  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      let newPhotos = [ ...prev ];
      newPhotos = newPhotos.filter((item, idx) => idx !== index && item);
      if (newPhotos.length < 10) newPhotos.push(null);
      return newPhotos;
    });
  };

  const getInitialProductData = async () => {
    const product: productRoot = await dispatch(getMyProduct({ product_id: product_id })).unwrap();
    setShopData({
      description: product.description,
      title: product.title,
      category: product.categories[ product.categories.length - 1 ].id,
      store: store,
      brand: product.brand,
      price: product.price.toString(),
    });

    setPhotos(() => {
      const res: Array<{image: string; file?: File, id?: number} | null> =
        product.product_photos.map(item => ({ id: item.id, image: item.photo }));
      if (res.length < 10) res.push(null);
      return res;
    });


    setSelectedCategory(product.categories[ 0 ] ?? null);
    setSelectedSubCategory(product.categories[ 1 ] ?? null);
  };

  const clearFormData = () => {
    setShopData({
      title: '',
      description: '',
      category: 0,
      store: '',
      price: '',
      brand: '',
    });

    setPhotos([ null ]);
    setPhotoLabelShow(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);

    handleDeleteProduct();
    customAlert(AlertVariants.success, 'Ваши данные успешно удалены', 3000);
  };

  const handleDeleteProduct = async () => {
    try {
      dispatch(deleteProduct({ productId: product_id, storeId: store }));
      router.push(PATHS.profileShops);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  useEffect(() => {
    dispatch(getCategories());
    if (action === ShopAction.Edit) getInitialProductData();
  }, []);

  useEffect(() => {
    setCategoriesOptions(categories ?? []);
  }, [ categories ]);


  return (
    <form className={`${classes.form} ${isPreviewProduct ? classes.preview : ''}`} onSubmit={handleSubmit}>
      <HTag level={4}>Настройки товара</HTag>
      <p className={classes.caption}>
        {isPreviewProduct ? 'Проверить данные товара' : action === ShopAction.Edit ?
          'Изменить данные товара' : 'Добавить данные товара'}
      </p>
      <div className={classes.data}>
        <p className={`${isPreviewProduct ? classes.caption : classes.textareaLabel}`}>
          {t('addAPhoto')}{!isPreviewProduct && <RequiredMark />}
          <span className={classes.helperAddPhoto}>(до 10 фото)</span>
        </p>
        <div className={classes.addPhotoContainer}>
          <div className={classes.addPhoto}>
            {photos[ 0 ]?.image ? (
              <>
                <input
                  id="photoInput"
                  type=""
                  style={{ display: 'none' }}
                  multiple
                />
                <label htmlFor="photoInput" className={classes.photoLabel}>
                  <img className={classes.previewImage} src={photos[ 0 ].image} alt="Preview" />
                </label>
                {!isPreviewProduct && (<span className={classes.removePhoto} onClick={() => handleRemovePhoto(0)}>
                  <img src={closeIcon.src} alt="Remove" />
                </span>)}
              </>
            ) : (
              !isPreviewProduct &&
              <>
                <input
                  id="photoInput"
                  type= {!isPreviewProduct ? 'file' : ''}
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e, 0)}
                  style={{ display: 'none' }}
                  multiple
                />
                <label htmlFor="photoInput" className={classes.photoLabel}>
                  <img className={classes.mainPhotoIcon} src={photoSvg.src} alt="Camera Icon" />
                  <p className={classes.photoDesc}>
                    Главное фото будет отображаться в результатах поиска
                  </p>
                  <p className={classes.photoAdd}>Добавить</p>
                </label>
              </>
            )}
            {photos.length === 1 && isPreviewProduct && (
              <div className={classes.emptyImage}>
                <Image
                  src={GelleryIcon}
                  alt='Изображение отсутствует' />
              </div>
            )}
          </div>
          <div className={classes.blockNewPhoto}>
            {photos.slice(1).map((photo, index) => (
              photo?.image ? (
                <div key={index} className={classes.addPhotoNew}>
                  {!isPreviewProduct && (
                    <span className={classes.removePhoto} onClick={() => handleRemovePhoto(index + 1)}>
                      <img src={closeIcon.src} alt="Remove" />
                    </span>
                  )}
                  <label
                    htmlFor={`photoInput${index}`}
                    className={photoLabelShow ? classes.photoLabel : classes.photoLabelNone}>
                    <div className={classes.photoContainer}>
                      <img
                        className={classes.previewImage} src={photo.image} alt={`Preview ${index}`} />
                    </div>
                  </label>
                  <input
                    id={`photoInput${index}`}
                    type=""
                    style={{ display: 'none' }}
                    multiple
                  />
                </div>
              ) : (
                !isPreviewProduct && (
                  <div className={classes.addPhotoNew}>
                    <label
                      htmlFor={`photoInput${index}`}
                      className={photoLabelShow ? classes.photoLabel : classes.photoLabelNone}>
                      <div className={classes.photoContainer}>
                        <img className={classes.photoIcon} src={photoSvg.src} alt="Camera Icon" />
                        <p className={classes.photoAdd}>Добавить</p>
                      </div>
                    </label>
                    <input
                      id={`photoInput${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, index + 1)}
                      style={{ display: 'none' }}
                      multiple
                    />
                  </div>
                )
              )
            ))}
          </div>
        </div>
        <div>
          <Input
            value={shopData.title}
            onChange={(e) => {
              handleSetShopData('title', e.target.value);
            }}
            label={
              <p className={classes.isPreview ? classes.caption : ''}>
              Название товара{!isPreviewProduct && <RequiredMark />}
              </p>
            }
            placeholder='Введите название товара'
            disabled={isPreviewProduct}
          />
        </div>

        <div>
          <p>{t('description')}</p>
          <textarea
            className={classes.descriptionArea}
            value={shopData.description}
            onChange={(e) => {
              const { value } = e.target;
              if (value.length > MAX_SHOP_DESCRIPTION_LENGTH) return;
              handleSetShopData('description', value);
            }}
            disabled={isPreviewProduct}
            placeholder='Добавьте описание более 70 символов'
          />
          <p className={classes.charCounter}>{shopData.description.length}/{MAX_SHOP_DESCRIPTION_LENGTH}</p>
        </div>

        <div className={classes.categories}>
          <div className={classes.selectCategory}>
            <p>{t('category')}{!isPreviewProduct && <RequiredMark />}</p>
            <FIlterSelect
              secondary
              menuClass={classes.menuCreate}
              options={!isPreviewProduct ? categoriesOptions : []}
              label={selectedCategory ? selectedCategory.title : 'Выберите категорию'}
              changeOption={handleCategoryChange}
            />
          </div>

          <div className={`
          ${classes.selectPodCategory}
          ${subCategoriesOptions.length === 0 ? classes.disabledLabel : ''}
          `}>
            <p>
              {t('subcategory')}
              {/* {!isPreviewProduct && <RequiredMark /> } */}
            </p>
            <FIlterSelect
              disabled={subCategoriesOptions.length === 0}
              secondary
              className={classes.selectCategoryFilter}
              menuClass={classes.menuCreate}
              options={!isPreviewProduct ? subCategoriesOptions : []}
              label={selectedSubCategory ? selectedSubCategory.title : 'Выберите подкатегорию'}
              changeOption={handleSubCategoryChange}
            />
          </div>
        </div>

        <div className={classes.brand}>
          <Input
            placeholder='Введите название бренда'
            label={<p>{'Название бренда'}{!isPreviewProduct && <RequiredMark/> }</p>}
            value={shopData.brand}
            onChange={(e) => {
              handleSetShopData('brand', e.target.value);
            }}
            disabled={isPreviewProduct}
          />
        </div>

        <div className={classes.brand}>
          <Input
            placeholder='Введите цену'
            label={<p>{'Цена (сом)'}{!isPreviewProduct && <RequiredMark />}</p>}
            value={shopData.price}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^\d]/g, '');
              handleSetShopData('price', newValue);
            }}
            onKeyPress={(e) => {
              const isDigit = /\d/.test(e.key);
              if (!isDigit) {
                e.preventDefault();
              }
            }}
            disabled={isPreviewProduct}
          />
        </div>

        {errors && <p className={classes.errorText}>{errors}</p>}

        <div className={classes.buttons}>
          <Button className={classes.saveButton} disabled={isLoading}>{t('saveData')}</Button>
          {!isPreviewProduct &&
            <Button
              variant={BUTTON_VARIANTS.DELETE}
              onClick={clearFormData}
              disabled={isLoading}
            >
              {t('deleteData')}
            </Button>
          }
          {isPreviewProduct &&
          <Button
            type='button'
            disabled={isLoading}
            variant={BUTTON_VARIANTS.OUTLINED}
            className={classes.editCreation}
            onClick={() => {
              setIsPreviewProduct(false);
            }}
          >
            {t('changeData')}
          </Button>
          }
        </div>
      </div>
    </form>
  );
};
