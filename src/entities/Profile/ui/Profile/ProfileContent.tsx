import { useRouter } from 'next/router';
import React from 'react';
import { FieldAction, ProfileTab, ShopAction } from '@/shared/lib/constants/constants';
import { ProfileShops } from '@/entities/MyShops/ui/ProfileShops/ProfileShops';
import { CreateEditShop } from '@/entities/MyShops/ui/CreateEditShop/CreateEditShop';
import { CreateEditProduct } from '@/entities/MyProducts/ui/CreateEditProduct/CreateEditProduct';
import classes from './profile.module.scss';
import { MyFields } from './MyFields/MyFields';
import { Settings } from './Settings/Settings';
import { CreateAddressField } from './CreateAddressField/CreateAddressField';
import { BookField } from './BookField/BookField';


const ProfileContent = () => {
  const router = useRouter();

  const renderContent = () => {
    switch (router.query.tab) {
    case ProfileTab.Fields: return <MyFields/>;
    case ProfileTab.Settings: return <Settings/>;
    case ProfileTab.BookField: return <BookField/>;
    case ProfileTab.CreateField: return <CreateAddressField/>;
    case ProfileTab.EditField: return <CreateAddressField action={FieldAction.Edit} />;
    case ProfileTab.Shops: return <ProfileShops/>;
    case ProfileTab.CreateShop: return <CreateEditShop action={ShopAction.Create} />;
    case ProfileTab.EditShop: return <CreateEditShop action={ShopAction.Edit} />;
    case ProfileTab.CreateProduct: return <CreateEditProduct/>;
    case ProfileTab.EditProduct: return <CreateEditProduct action={ShopAction.Edit}/>;
    default: return <></>;
    }
  };

  return <div className={classes.wrapper}>
    {renderContent()}
  </div>;
};

export default ProfileContent;
