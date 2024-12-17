import { Menu } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar } from "@mui/material";

export default function TopBar() {
    return (
        <AppBar position="static" className="w-75%">
            <Toolbar>
                <IconButton color="inherit" aria-label="open drawer" onClick={() => { }} edge="start">
                    <Menu />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
