import React, { FC } from 'react';
import { AddressField, BUTTON_VARIANTS } from '@/shared/lib/constants/constants';
import { truncateText } from '@/shared/lib/helpers/helpers';
import useIsMobile from '@/shared/lib/hooks/useIsMobile';
import { Button } from '../Button/Button';
import classes from './myFields.module.scss';


const LIMIT_TEXT_LENGTH = 20;

interface MyFieldsListProps {
  list: AddressField[];
  onButtonClick?: (item: AddressField) => void;
  deleteButton?: boolean;
  onDelete?: (item: AddressField) => void;
  buttonText?: string
}

export const MyFieldsList: FC<MyFieldsListProps> = ({
  list,
  onButtonClick,
  buttonText = 'Изменить',
  deleteButton,
  onDelete,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <ul className={classes.fieldsHeader}>
        <li>№</li>
        <li>Название</li>
        <li>Адрес</li>
      </ul>
      <ul className={classes.fieldsBody}>
        {list.map((item, idx) => (
          <li key={item.id}>
            <div>
              <p className={classes.number}>{idx + 1}</p>
              <div className={classes.addressInfo}>
                <p className={classes.name}>
                  {isMobile ? truncateText(item.area_data.name, LIMIT_TEXT_LENGTH) : item.area_data.name}
                </p>
                <p className={classes.address}>
                  {item.address_link ? (
                    <a href={item.address_link} target='_blank'>
                      {isMobile ? truncateText(item.address, LIMIT_TEXT_LENGTH) : item.address}
                    </a>
                  ) : isMobile ? truncateText(item.address, LIMIT_TEXT_LENGTH) : item.address}
                </p>
              </div>
            </div>

            <div className={classes.buttons}>
              {deleteButton &&
                <Button variant={BUTTON_VARIANTS.DELETE} onClick={() => onDelete && onDelete(item)}>Удалить</Button>
              }
              <Button onClick={() => onButtonClick && onButtonClick(item)}>{buttonText}</Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
