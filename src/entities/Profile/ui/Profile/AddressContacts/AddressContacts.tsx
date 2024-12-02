import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/Input/Input';
import { AddButton } from '@/shared/ui/AddButton/AddButton';
import close from '@/icons/closeDark.svg';
import classes from './contacts.module.scss';


interface Contact {
  number: string
}

interface Props {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
}

export const AddressContacts:FC<Props> = ({ contacts, setContacts }) => {
  const { t } = useTranslation();

  return (
    <div className={classes.contacts}>
      <p>{t('contacts')}</p>
      <ul className={classes.contactsList}>
        {contacts.map((item, idx) => (
          <li key={idx}>
            <Input
              value={item.number}
              onChange={(e) => {
                const prev = [ ...contacts ];
                const value = e.target.value;

                if (value.length === 14) return prev;
                if (value.length === 3) return prev;

                prev[ idx ].number = e.target.value;
                setContacts(prev);
              }}
            />
            {idx > 0 && <img onClick={() => {
              setContacts([ ...contacts ].filter((item, i) => i !== idx));
            }} className={classes.close} src={close.src} alt='x'/>}
          </li>
        ))}
      </ul>
      <AddButton onClick={() => setContacts([ ...contacts, { number: '+996' } ])}>
        {t('addANumber')}
      </AddButton>
    </div>
  );
};
