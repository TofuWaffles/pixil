import { Grid2 } from "@mui/material";
import { Thumbnail } from "../types/props";
import ThumbnailBox from "./Thumbnail";

export default function ThumbnailGroup({ title, thumbnails }: { title: string, thumbnails: Thumbnail[] }) {
  let tboxes = thumbnails.map((value, key) => {
    return (
      <Grid2 key={key} className="size-fit">
        <ThumbnailBox thumbnail={value} />
      </Grid2>
    )
  })
  return (
    <div className="lg: size-9/12">
      <h1 className="font-bold p-2 text-lg">{title}</h1>
      < Grid2 container direction="row" spacing={1}>
        {tboxes}
      </Grid2 >
    </div>
  )
}
