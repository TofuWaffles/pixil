import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDialog({
  title,
  message,
  open,
  setOpen,
  confirmOnClick,
}: {
  title: string,
  message: string,
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  confirmOnClick: React.MouseEventHandler<HTMLButtonElement> | undefined
}) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle id="confirm-delete">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            color: "secondary.main"
          }}
          onClick={() => setOpen(false)}
        >Cancel</Button>
        <Button
          sx={{
            color: "secondary.main"
          }}
          onClick={confirmOnClick}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
