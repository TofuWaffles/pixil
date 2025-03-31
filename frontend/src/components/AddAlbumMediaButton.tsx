import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import IconButton from '@mui/material/IconButton';
import backendRequest from '../utils/BackendRequest';
import { Box, Button, Dialog, DialogContent, DialogTitle, InputLabel, MenuItem, Select } from '@mui/material';
import React, { ReactElement } from 'react';
import { Album, AlbumMedia, } from '../types/Models';

export default function AddAlbumMediaButton({ mediaId }: { mediaId: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Box>
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
          sx={{ backgroundColor: "secondary.main" }}
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
            // TODO: handle the error I guess
          }}
        >
          Add
        </Button>
      </DialogContent>
    </Dialog >
  )
}
