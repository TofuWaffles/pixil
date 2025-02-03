import { Box } from '@mui/material';
import { Thumbnail } from '../types/props';
import React, { SetStateAction } from 'react';
import ImageView from './ImageView';

export default function ThumbnailBox({ thumbnail, setImgView }: {
  thumbnail: Thumbnail,
  setImgView: React.Dispatch<SetStateAction<React.ReactNode | null>>,
}) {
  return (
    <Box
      onClick={() => {
        setImgView(ImageView({ mediaID: thumbnail.id }))
      }}
      className="size-24 md:size-48 lg:size-64 border-2 border-french-gray-2"
      component="img"
      alt="User Image"
      src={thumbnail.src}
    />
  );
}

