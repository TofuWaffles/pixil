import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

export default function SearchBar(setSearchQuery: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <form>
      <TextField
        id="search-bar"
        className="text"
        onChange={(event) => {
          setSearchQuery(event.target.value);
        }}
        label="Search pictures and videos"
        variant="outlined"
        placeholder="Search..."
        size="small"
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </form>
  )
}
