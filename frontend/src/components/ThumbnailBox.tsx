import { Box } from '@mui/material';
import { Thumbnail } from '../types/props';
import React, { SetStateAction } from 'react';

export default function ThumbnailBox({ thumbnail, setImgViewOpen, setImgViewID }: {
  thumbnail: Thumbnail,
  setImgViewOpen: React.Dispatch<SetStateAction<boolean>>,
  setImgViewID: React.Dispatch<SetStateAction<number>>,
}) {
  return (
    <Box
      onClick={() => {
        setImgViewOpen(true)
        setImgViewID(thumbnail.id)
      }}
      className="size-24 md:size-48 lg:size-64 border-2 border-french-gray-2"
      component="img"
      alt="User Image"
      src={thumbnail.src}
    />
  );
}

