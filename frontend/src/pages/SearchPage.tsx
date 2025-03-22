import React from "react";
import Box from "@mui/material/Box/Box";
import Gallery from "../components/Gallery";

export function SearchPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  return (
    <Box>
      <Gallery></Gallery>
    </Box>
  )
}
