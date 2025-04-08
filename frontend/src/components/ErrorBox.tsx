import Alert from "@mui/material/Alert";

export default function ErrorBox({ message }: { message: string }) {
  return (
    (message.length > 0) && <Alert severity="error" variant="filled" sx={{ m: 5 }}>{message}</Alert>
  )
}
