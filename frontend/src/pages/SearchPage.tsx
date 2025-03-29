import React from "react";
import Box from "@mui/material/Box/Box";
import Gallery from "../components/Gallery";
import SearchBar from "../components/SearchBar";

export function SearchPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  return (
    <Box>
      <SearchBar setSearchQuery={setSearchQuery} />
      <Gallery queryParams={`tag=${searchQuery}`} />
    </Box>
  )
}
