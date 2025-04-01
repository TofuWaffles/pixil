import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import backendRequest from '../utils/BackendRequest';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  right: 0,
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledTextField = styled(TextField)(({ }) => ({
  '& .MuiInputBase-root': {
    color: 'inherit',
    width: '20ch',
  },
}));

export default function SearchBar({ setSearchQuery }: { setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) {
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchTags = async () => {
      const response = await backendRequest(null, "GET", "/tags", true);
      const tags: string[] = await response.json();

      setTags(tags);
    }

    fetchTags();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{
        width: "100%",
        position: "static",
        marginLeft: 0,
        flex: 1,
        paddingRight: 0,
      }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Search Images and Videos
          </Typography>
          <Autocomplete
            freeSolo
            id="tag-search-autocomplete"
            disableClearable
            options={tags}
            onInputChange={(_, value) => {
              setSearchQuery(value);
            }}
            renderInput={(params) => (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledTextField
                  {...params}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                    }
                  }}
                  placeholder="Search…"
                  autoFocus={true}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                  }}
                />
              </Search>
            )}
          />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
