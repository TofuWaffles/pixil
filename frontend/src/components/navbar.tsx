import { AcUnit, Label, People, PhotoAlbum, Place } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';

function Logo() {
    return (
        <div className='w-full aspect-square pt-5'><AcUnit sx={{ fontSize: 40 }}></AcUnit></div>
    )
}

export default function Navbar() {
    return (
        <div className="w-[15%] md:w-[5%] h-screen bg-platinum border-x-eerie-black border-x-2 border-y-eerie-black justify-center">
            <div className="w-full m-auto grid gap-20">
                <Logo></Logo>
                <div className='w-full justify-center grid gap-5'>
                    <IconButton className='text-center aspect-square'><FavoriteBorderIcon sx={{ fontSize: 40 }}></FavoriteBorderIcon></IconButton>
                    <IconButton className='text-center aspect-square'><PhotoAlbum sx={{ fontSize: 40 }}></PhotoAlbum></IconButton>
                    <IconButton className='text-center aspect-square'><People sx={{ fontSize: 40 }}></People></IconButton>
                    <IconButton className='text-center aspect-square'><Label sx={{ fontSize: 40 }}></Label></IconButton>
                    <IconButton className='text-center aspect-square'><Place sx={{ fontSize: 40 }}></Place></IconButton>
                </div>
            </div>
        </div>
    );
};
