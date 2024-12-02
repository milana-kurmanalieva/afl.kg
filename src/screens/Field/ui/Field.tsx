import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Container } from '@/shared/ui/Container/Container';
import TopContent from '@/shared/ui/TopContent/TopContent';
import { Meta } from '@/shared/ui/seo/Meta';
import { BannerRow } from '@/entities/Banners';
import FieldDetails from '@/widgets/FieldInfo/ui/FieldDetails/FieldDetails';
import FieldImages from '@/widgets/FieldInfo/ui/FieldImages/FieldImages';
import { getAddress, getField, selectFieldAddress } from '@/entities/Field/model/FieldSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import { FieldAddressById } from '@/entities/Field/type/fieldSchema';
import { Arrow } from '@/shared/ui/Arrow/Arrow';
import { DATE_FORMAT_FIELD, DayNumber, Directions, PATHS } from '@/shared/lib/constants/constants';
import { HTag } from '@/shared/ui/HTag/HTag';
import { DatePickerComponent } from '@/shared/ui/DatePicker';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { WorkHoursList } from '@/entities/Profile/ui/Profile/BookField/WorkHoursList';
import classes from './field.module.scss';


export const Field:NextPage<FieldAddressById> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile();

  const locationId = +(router.query.id as string);

  const { address, field } = useSelector(selectFieldAddress);

  const [ selectedFieldId, setSelectedFieldId ] = useState<number | null>(null);
  const [ selectedDate, setSelectedDate ] = useState(new Date());

  const pages = [
    {
      href: '',
      page: t('infoCenter'),
      disabled: true,
    },
    {
      href: PATHS.catalog,
      page: 'Справочник',
    },
    {
      href: '',
      page: field?.name ?? '',
    },
  ];

  const defaultFieldId = useMemo(() => address?.fields?.[ 0 ]?.id,
    [ address?.fields?.[ 0 ]?.id ]);

  const handleChangeDay = (newDate?: Date) => {
    if (newDate && selectedFieldId && field.working_days.includes(newDate.getDay() as DayNumber)) {
      setSelectedDate(newDate);
      dispatch(getField({ id: selectedFieldId, date: format(newDate, DATE_FORMAT_FIELD) }));
    }
  };

  useEffect(() => {
    dispatch(getAddress({ location_id: locationId }));
  }, [ locationId ]);

  useEffect(() => {
    if (!defaultFieldId) return;
    setSelectedFieldId(defaultFieldId);
    dispatch(getField({ id: defaultFieldId, date: format(new Date(), DATE_FORMAT_FIELD) }));
  }, [ defaultFieldId ]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, [ selectedFieldId ]);

  return (
    <>
      <Meta title={ t('catalog') } description=''>
      </Meta>
      <Container variant='large'>
        <TopContent title={ address.name } breadcrumbs={ pages } className={classes.title}/>
        <div className={classes.icon}
          onClick={() => router.back()}>
          <Arrow direction={Directions.left} className={classes.arrow}/>
        </div>
        <BannerRow/>
        <div className={ classes.fieldInfo }>
          {!isMobile && <FieldDetails
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId} fieldAddress = {address}
          />}

          <div className={classes.calendar}>
            <div className={classes.images}>
              <FieldImages/>
              <p className={classes.titleMobile}>{address.name}</p>
            </div>
            {isMobile && <FieldDetails
              selectedFieldId={selectedFieldId}
              setSelectedFieldId={setSelectedFieldId} fieldAddress = {address}
            />}
            <div className={classes.calendarContent}>
              <HTag level={4}>{t('freeTimeForReservation')}
                <span className={classes.fieldName}>«{field.name}»</span></HTag>
              <DatePickerComponent
                selected={selectedDate}
                onChangeDate={handleChangeDay}
                workingDays={field.working_days}
              />
              {selectedFieldId && <WorkHoursList
                field={field}
                date={selectedDate}
                forUser
              />}
            </div>
          </div>
        </div>

      </Container>
    </>
  );
};
