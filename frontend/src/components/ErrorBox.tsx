import Alert from "@mui/material/Alert";

export default function ErrorBox({ message }: { message: string | null }) {
  return (
    (message !== null && message.length > 0) && <Alert severity="error" variant="filled" sx={{ m: 5 }}>{message}</Alert>
  )
}
