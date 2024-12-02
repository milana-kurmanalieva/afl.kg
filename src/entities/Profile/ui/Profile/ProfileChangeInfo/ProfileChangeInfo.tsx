// ProfileChangeInfo.jsx
import React, { FC, FormEvent, Dispatch, SetStateAction, useEffect } from 'react';
import { Input } from '@/shared/ui/Input/Input';
import { getProfile } from '@/entities/Auth/model/authSlice';
import { useAppDispatch } from '@/app/providers/StoreProvider';
import classes from './profileChangeInfo.module.scss';


interface ProfileChangeInfoProps {
  handleSubmit: (e: FormEvent) => Promise<void>;
  typeInput: 'email' | 'password';
  existingInput: string;
  setExistingInput: Dispatch<SetStateAction<string>>;
  existingInputLabel: string;
  newInfoInput: string;
  setNewInfoInput: Dispatch<SetStateAction<string>>;
  newInfoInputLabel: string;
  confirmPasswordInput: string;
  setConfirmPasswordInput: Dispatch<SetStateAction<string>>;
  confirmPasswordInputLabel: string;
  textButton: string;
}

export const ProfileChangeInfo: FC<ProfileChangeInfoProps> = ({
  handleSubmit,
  typeInput,
  existingInput,
  setExistingInput,
  existingInputLabel,
  newInfoInput,
  setNewInfoInput,
  newInfoInputLabel,
  confirmPasswordInput,
  setConfirmPasswordInput,
  confirmPasswordInputLabel,
  textButton,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await dispatch(getProfile());
        const profileData = profile.payload;
        if (typeInput === 'email') {
          setExistingInput(profileData.email);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [
    dispatch,
    setExistingInput,
    typeInput,
  ]);


  return (
    <div>
      <form id={typeInput} className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.existingPasswordBlock}>
          <Input
            type={typeInput}
            value={existingInput}
            onChange={(e) => setExistingInput(e.target.value)}
            label={existingInputLabel}
            placeholder={existingInputLabel}
          />
        </div>
        <div className={classes.newPasswordBlock}>
          <div className={classes.newPasswordInput}>
            <Input
              type={typeInput}
              value={newInfoInput}
              onChange={(e) => setNewInfoInput(e.target.value)}
              label={newInfoInputLabel}
              placeholder={newInfoInputLabel}
            />
          </div>
          <div className={classes.newPasswordInput}>
            <Input
              height={'50px'}
              type='password'
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              label={confirmPasswordInputLabel}
              placeholder={confirmPasswordInputLabel}
            />
          </div>
        </div>
        <button className={classes.passwordChangeButton} type="submit">
          {textButton}
        </button>
      </form>
    </div>
  );
};
