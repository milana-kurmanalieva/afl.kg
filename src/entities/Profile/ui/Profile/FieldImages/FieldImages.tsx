import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'next-i18next';
import photo from '@/icons/photo.svg';
import closeIcon from '@/icons/blackClose.svg';
import classes from './fieldImages.module.scss';


interface FieldImagesProps {
  photos: any[];
  setPhotos: Dispatch<SetStateAction<any>>
}

export const FieldImages: FC<FieldImagesProps> = ({ photos, setPhotos }) => {
  const { t } = useTranslation();

  // FIX_ME: refactor
  return (
    <div className={classes.photos}>
      <p>{t('addAPhoto')}</p>
      <ul>
        {photos.map((_, idx) => (
          <li key={idx}>
            {photos[ idx ]?.url && (
              <img
                onClick={() => {
                  const prev = [ ...photos ];
                  prev.splice(idx, 1);
                  prev.push(null);
                  setPhotos(prev);
                }}
                className={ classes.deletePhoto}
                src={closeIcon.src} alt="close"
              />
            )}
            <input
              onClick={(e: any) => {
                e.target.value = null;
              }}
              onChange={(e: any) => {
                const file = e.target.files[ 0 ];
                if (!file) return;
                const reader = new FileReader();

                reader.onload = function(e: any) {
                  const prev = [ ...photos ];
                  const emptyElementIdx = prev.findIndex((item: any) => !item);
                  prev[ emptyElementIdx ] = { url: e.target.result, photo: file };
                  setPhotos(prev);
                };

                reader.readAsDataURL(file);
              }}
              type={photos[ idx ] ? 'button' : 'file'}
              id={idx.toString()}
            />
            <label
              htmlFor={idx.toString()}
            >
              <img
                className={photos[ idx ]?.url ? classes.selectedPhoto : classes.emptyPhoto}
                src={photos[ idx ]?.url ?? photo.src}
                alt='photo'
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
