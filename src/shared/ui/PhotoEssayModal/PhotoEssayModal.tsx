import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import { useSelector } from 'react-redux';
import { selectPhotoEssay } from '@/entities/PhotoEssay/model/PhotoEssaySlice';
import downloadIcon from '@/icons/download.svg';
import closeIcon from '@/icons/close.svg';
import classes from './photoModal.module.scss';


const getBase64FromUrl = async (url: string): Promise<string> => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data as string);
    };
  });
};

const CustomSlide = ({ item, closeModal } : {item: ReactImageGalleryItem, closeModal: () => void }) => {
  const downloadImage = () => {
    getBase64FromUrl(item.original).then((url: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Image.png';
      a.click();
    });
  };


  return (
    <div className={classes.imageGalleryContent}>
      <img className={classes.img}
        src={item.original} alt={item.originalAlt} ></img>
      <button onClick={downloadImage} className={classes.button}>
        <img className={classes.img} src={downloadIcon.src} alt="download" ></img>
      </button>
      <button onClick={closeModal} className={classes.closeButton}>
        <img src={closeIcon.src} alt="close"></img>
      </button>
    </div>

  );
};


interface IPhotoInfo {
  isGalleryOpen: boolean;
  setIsGalleryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  startIndex: number;
}


export const PhotoEssayModal:FC<IPhotoInfo> = ({ isGalleryOpen, setIsGalleryOpen, startIndex }) => {

  const { photoEssayData } = useSelector(selectPhotoEssay);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [ isMounted, setIsMounted ] = useState(false);


  const closeModal = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const galleryItems: ReactImageGalleryItem[] = photoEssayData.images.map((images) => ({ original: images.image }));

  return (
    createPortal(
      <div className={classes.container}>
        <div onClick={closeModal} className={classes.background}></div>
        <AnimatePresence>
          {isGalleryOpen && (
            <motion.div
              ref={modalRef}
              className={classes.content}
              initial={{ translateX: 300, opacity: 0 }}
              animate={{ translateX: 0, opacity: 1 }}
              exit={{ translateX: 300, opacity: 1 }}
              transition={{ duration: .5, type: 'tween' }}
            >
              <ImageGallery
                startIndex={startIndex}
                showBullets
                showPlayButton={true}
                items={galleryItems}
                renderItem={(item) => <CustomSlide closeModal={closeModal} item={item} />} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>,
      document.body,
    )
  );
};
