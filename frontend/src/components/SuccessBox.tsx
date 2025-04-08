import Alert from "@mui/material/Alert";

export default function SuccessBox({ message }: { message: string }) {
  return (
    (message.length > 0) && <Alert severity="success" variant="filled" sx={{ m: 5 }}>{message}</Alert>
  )
}
