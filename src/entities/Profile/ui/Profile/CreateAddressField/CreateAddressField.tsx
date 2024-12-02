import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { v4 as uuidv4 } from 'uuid';
import { HTag } from '@/shared/ui/HTag/HTag';
import FIlterSelect from '@/shared/ui/FIlterSelect/FIlterSelect';
import { Input } from '@/shared/ui/Input/Input';
import { useAppDispatch, useAppSelector } from '@/app/providers/StoreProvider';
import {
  createField,
  createFieldPhoto,
  deleteField,
  editField,
  getMyField,
  getMyAddresses,
  selectMyFields,
  setField,
} from '@/entities/Profile/model/myFieldsSlice';
import {
  BUTTON_VARIANTS,
  DayNumber, FieldAction,
  PATHS,
  WEEK_DAYS,
} from '@/shared/lib/constants/constants';
import { Button } from '@/shared/ui/Button/Button';
import profileClasses from '../profile.module.scss';
import { FieldImages } from '../FieldImages/FieldImages';
import { CreateAddress } from '../CreateAddress/CreateAddress';
import { TimePayments } from '../TimePayments/TimePayments';
import { WorkingTime } from '../WorkingTime/WorkingTime';
import { AddressContacts } from '../AddressContacts/AddressContacts';
import classes from './create.module.scss';


const PHOTOS_COUNT = 4;

const HOURS = [
  { id: 1, title: '00:00' },
  { id: 2, title: '01:00' },
  { id: 3, title: '02:00' },
  { id: 4, title: '03:00' },
  { id: 5, title: '04:00' },
  { id: 6, title: '05:00' },
  { id: 7, title: '06:00' },
  { id: 8, title: '07:00' },
  { id: 9, title: '08:00' },
  { id: 10, title: '09:00' },
  { id: 11, title: '10:00' },
  { id: 12, title: '11:00' },
  { id: 13, title: '12:00' },
  { id: 14, title: '13:00' },
  { id: 15, title: '14:00' },
  { id: 16, title: '15:00' },
  { id: 17, title: '16:00' },
  { id: 18, title: '17:00' },
  { id: 19, title: '18:00' },
  { id: 20, title: '19:00' },
  { id: 21, title: '20:00' },
  { id: 22, title: '21:00' },
  { id: 23, title: '22:00' },
  { id: 24, title: '23:00' },
];

interface Props {
  action?: FieldAction;
}


const FIELD_TYPES = [
  { id: 1, title: 'covered', value: 'covered' },
  { id: 2, title: 'uncovered', value: 'uncovered' },
  { id: 3, title: 'hall', value: 'hall' },
];

const initialState = {
  fieldName: '',
  selectedAddress: null,
  selectedFieldType: FIELD_TYPES[ 0 ],
  timePayments: [ { id: uuidv4(), from_time: HOURS[ 0 ], till_time: HOURS[ HOURS.length - 1 ], price: 0 } ],
  workingDays: Object.keys(WEEK_DAYS).map(item => +item) as DayNumber[],
  fromTime: HOURS[ 0 ].title,
  tillTime: HOURS[ HOURS.length - 1 ].title,
  contacts: [ { number: '+996' } ],
  photos: [ ...Array(PHOTOS_COUNT) ].fill(null),
};

export const CreateAddressField: FC<Props> = ({ action = FieldAction.Create }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();

  const addressId = router.query.address_id;
  const fieldId = +(router.query.field_id as string);

  const { myAddresses, field } = useAppSelector(selectMyFields);

  const [ fieldData, setFieldData ] = useState<any>(initialState);
  const [ error, setError ] = useState<Record<string, string>>({});
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSetError = (key: string, value: string) => {
    setError((prev) => ({ ...prev, [ key ]: value }));
  };

  const validateFieldResponse = (res: {error: true, data: Array<string>}): boolean => {
    const hasPhoto = fieldData.photos.some((item: any) => item);
    if (!res?.error && hasPhoto) return true;
    for (const key in res.data) {
      if (key === 'field_contacts') {
        handleSetError(key, t('checkIfAllContactsAreCorrect'));
        continue;
      }
      handleSetError(key, res.data[ key ][ 0 ]);
    }
    if (!hasPhoto) handleSetError('photos', t('uploadAtLeastOnePhoto'));
    return false;
  };

  const createPhotos = async (id: number) => {
    return await dispatch(createFieldPhoto({
      fieldId: id,
      data: fieldData.photos.filter((item: any) => item),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError({});

    const payload = {
      name: fieldData.fieldName,
      from_time: fieldData.fromTime,
      till_time: fieldData.tillTime,
      working_days: fieldData.workingDays,
      time_payments: fieldData.timePayments.map((item: any) =>
        ({ ...item, from_time: item.from_time.title, till_time: item.till_time.title })),
      field_contacts: fieldData.contacts,
      field_type: fieldData.selectedFieldType.value,
      location: fieldData.selectedAddress.id,
    };

    let res: any = null;

    if (action === FieldAction.Create) res = await dispatch(createField(payload as any)).unwrap();
    if (action === FieldAction.Edit && field.id) res = await dispatch(editField(
      { body: payload as any, fieldId: field.id ?? +addressId! },
    )).unwrap();
    await dispatch(getMyAddresses());

    setIsLoading(false);

    const isValid = validateFieldResponse(res);
    if (!isValid) return;

    if (res) createPhotos(res.id);
    router.push(PATHS.profileFields);
  };

  const handleDeleteField = async () => {
    await dispatch(deleteField({ fieldId: fieldId }));
    await dispatch(getMyAddresses());
    router.push(PATHS.profileFields);
  };

  useEffect(() => {
    dispatch(getMyAddresses());

    return () => {
      dispatch(setField(null));
      setFieldData(initialState);
    };
  }, [ ]);

  useEffect(() => {
    if (myAddresses.results.length) {
      setFieldData((prev: any) => ({ ...prev, selectedAddress: myAddresses.results[ 0 ] }));
    }
  }, [ myAddresses ]);

  useEffect(() => {
    if (fieldId && action === FieldAction.Edit) dispatch(getMyField({ fieldId: fieldId }));
  }, [ action, fieldId ]);

  useEffect(() => {
    if (!field || action === FieldAction.Create) return;
    let photos = field.field_photos
      ?.map((item: any) => ({ url: item.photo, id: item.id }))
      ?.slice(0, PHOTOS_COUNT);

    if (photos.length < PHOTOS_COUNT) {
      photos = photos.concat([ ...Array(PHOTOS_COUNT - photos.length) ].fill(null));
    }

    setFieldData((prev: any) => {
      return {
        ...prev,
        fieldName: field.name,
        selectedAddress: { id: field.location_data.id, title: field.location_data.address },
        photos,
        selectedFieldType: FIELD_TYPES.find(item => item.value === field.field_type),
        timePayments: field.time_payments.map((item: any) =>
          ({
            ...item,
            from_time: HOURS.find(hour => hour.title === item.from_time),
            till_time: HOURS.find(hour => hour.title === item.till_time),
          })),
        workingDays: field.working_days.map((item: string) => +item),
        fromTime: field.from_time,
        till_time: field.till_time,
        contacts: field.field_contacts.map((item: any) => ({ number: `${item.number}` })),
      };
    });

    return () => setFieldData(initialState);
  }, [ field, action ]);

  useEffect(() => {
    setError({});
  }, [ fieldData ]);

  return (
    <div>
      <form onSubmit={handleSubmit} className={classes.formCreate}>
        <HTag level={4}>{t('fieldSettings')}</HTag>
        <p className={profileClasses.caption}>
          {action === FieldAction.Edit ? t('changeFieldData') : t('createFieldData')}</p>

        <div className={classes.info}>
          <div>
            <FieldImages
              photos={fieldData.photos}
              setPhotos={(photos) => {
                setFieldData((prev: any) => ({ ...prev, photos }));
              }}
            />
            {error.photos && <p className={classes.error}>{error.photos}</p>}
          </div>

          <div className={classes.fieldName}>
            <Input
              value={fieldData.fieldName}
              onChange={(e) => setFieldData((prev: any) => ({ ...prev, fieldName: e.target.value }))}
              label={t('fieldName')}
              maxLength={30}
            />
            {error.name && <p className={classes.error}>{error.name}</p>}
          </div>

          {/* FIX_ME remake this logic to make it editable */}
          <div className={classes.locations}>
            <p>{t('address')}</p>
            {!!myAddresses.results.length && <FIlterSelect
              className={classes.select}
              secondary
              options={myAddresses.results.map((item: any) => ({ id: item.id, title: item.address }))}
              changeOption={(newAddress) => setFieldData((prev: any) => ({ ...prev, selectedAddress: newAddress }))}
              label={fieldData.selectedAddress?.title ?? ''}
            />}
          </div>

          <CreateAddress
            onCreate={(newAddress) => setFieldData((prev: any) => ({ ...prev, selectedAddress: newAddress }))}
          />

          <div className={classes.fieldType}>
            <p>{t('fieldType')}</p>
            <FIlterSelect
              className={classes.select}
              secondary
              options={FIELD_TYPES.map(item => ({ ...item, title: t(item.title) }))}
              changeOption={(type) => {
                setFieldData((prev: any) => ({ ...prev, selectedFieldType: type }));
              }}
              label={t(fieldData.selectedFieldType.title)}
            />
          </div>

          <TimePayments
            timePayments={fieldData.timePayments}
            setTimePayments={(newTimePayments) => {
              setFieldData((prev: any) => ({ ...prev, timePayments: newTimePayments }));
            }}
            hours={HOURS}
          />

          <div>
            <WorkingTime
              fromTime={fieldData.fromTime}
              setFromTime={(newTime) => {
                setFieldData((prev: any) => ({ ...prev, fromTime: newTime }));
              }}
              tillTime={fieldData.tillTime}
              setTillTime={(newTime) => {
                setFieldData((prev: any) => ({ ...prev, tillTime: newTime }));
              }}
              workingDays={fieldData.workingDays}
              setWorkingDays={(newDays) => {
                setFieldData((prev: any) => ({ ...prev, workingDays: newDays }));
              }}
              hours={HOURS}
            />

            {error.working_days && <p className={classes.error}>{error.working_days}</p>}
          </div>

          <div>
            <AddressContacts
              contacts={fieldData.contacts}
              setContacts={(newContacts) => {
                setFieldData((prev: any) => ({ ...prev, contacts: newContacts }));
              }}
            />
            {error.field_contacts && <p className={classes.error}>{error.field_contacts}</p>}
          </div>

          <div className={classes.buttons}>
            <Button disabled={isLoading}>{t('saveData')}</Button>
            {action === FieldAction.Edit &&
              <Button type='button' variant={BUTTON_VARIANTS.DELETE} onClick={handleDeleteField}>
                {t('deleteData')}</Button>
            }
          </div>
        </div>
      </form>
    </div>
  );
};
