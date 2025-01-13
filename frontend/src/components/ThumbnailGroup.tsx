import { Grid2 } from "@mui/material";
import { Thumbnail } from "../types/props";
import ThumbnailBox from "./Thumbnail";

export default function ThumbnailGroup({ title, thumbnails }: { title: string, thumbnails: Thumbnail[] }) {
  let tboxes = thumbnails.map((t) => {
    return (<Grid2 className="size-fit">
      <ThumbnailBox thumbnail={t} />
    </Grid2>
    )
  })
  return (
    <div className="lg: size-9/12">
      <h1>{title}</h1>
      < Grid2 container direction="row" spacing={1}>
        {tboxes}
      </Grid2 >
    </div>
  )
}
