import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import IconButton from '@mui/material/IconButton';
import backendRequest from '../utils/BackendRequest';
import React, { ReactElement } from 'react';
import { Album, AlbumMedia, } from '../types/Models';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';

export default function AddAlbumMediaButton({ mediaId }: { mediaId: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Box>
      <Tooltip title="Add to Album">
        <IconButton
          aria-label="add media to album"
          sx={{
            color: "white",
            width: 100,
            height: 100
          }}
          onClick={() => {
            setOpen(true);
          }}>
          <LibraryAddIcon sx={{ width: 40, height: 40 }} />
        </IconButton >
      </Tooltip>
      <AddAlbumMediaDialog mediaId={mediaId} open={open} setOpen={setOpen} />
    </Box>
  )
}

function AddAlbumMediaDialog({
  mediaId,
  open,
  setOpen
}: {
  mediaId: number,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [albumSelect, setAlbumSelect] = React.useState(1);

  React.useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await backendRequest(null, "GET", "/albums", true);
        setAlbums(await response.json())
      } catch {
        console.log("Something went wrong when retrieving the albums");
      }
    }

    fetchAlbums();
  }, []);

  let albumComponents: ReactElement[] = [];

  albums.forEach((album) => {
    albumComponents.push(<MenuItem
      value={album.id}
      key={`album-${album.id}`}
    >{album.name}</MenuItem>);
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>
        Add this media to an album
      </DialogTitle>
      <DialogContent>
        <InputLabel variant="standard">Album</InputLabel>
        <Select
          variant='filled'
          labelId="album-select"
          id="album-select"
          value={albumSelect}
          onChange={(event) => {
            setAlbumSelect(+event.target.value);
          }}
        >
          {albumComponents}
        </Select>
        <Button
          sx={{
            m: 1,
            backgroundColor: "secondary.main"
          }}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          onClick={async () => {
            await backendRequest(
              JSON.stringify({
                albumId: albumSelect,
                mediaId: mediaId,
              } as AlbumMedia),
              "POST",
              "/album_media",
              true
            );
            setOpen(false);
          }}
        >
          Add
        </Button>
      </DialogContent>
    </Dialog >
  )
}
