import React, { useContext } from "react";
import { User } from "../types/Models";
import Grid2 from "@mui/material/Grid2";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import CreateUserForm from "./CreateUserForm";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import { BackendApiContext } from "../App";
import ErrorBox from "./ErrorBox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "./ConfirmDialog";

export default function UserSettings() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [userSettingsError, setError] = React.useState("");
  const [usersRefresh, setUsersRefresh] = React.useState(true);
  const backendApi = useContext(BackendApiContext);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users: User[] = await backendApi.getUsers();
        setUsers(users);
      } catch (err: any) {
        setError(err);
      }
    }

    fetchUsers()
  }, [usersRefresh]);

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      width="80vw"
    >
      <ErrorBox message={userSettingsError} />
      <Accordion sx={{
        m: 3,
        width: "100%",
      }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="add-user-expand"
          id="add-user-header"
        >
          <Typography component="span">Create User</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CreateUserForm setUsersRefresh={setUsersRefresh} />
        </AccordionDetails>
      </Accordion>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Email Address</Box></Typography></TableCell>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Username</Box></Typography></TableCell>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Account Type</Box></Typography></TableCell>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Delete</Box></Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              users.map((user) => (
                <TableRow
                  key={user.email + "-row"}
                >
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{
                    user.userType == 0 ? "Member" : "Admin"
                  }</TableCell>
                  {user.email !== "admin@admin.com" &&
                    <TableCell>
                      <DeleteUserButton
                        email={user.email}
                        username={user.username}
                        setError={setError}
                        setUsersRefresh={setUsersRefresh}
                      />
                    </TableCell>
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2 >
  )
}

function DeleteUserButton({
  email,
  username,
  setError,
  setUsersRefresh,
}: {
  email: string,
  username: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setUsersRefresh: React.Dispatch<React.SetStateAction<boolean>>,
}) {
  const [open, setOpen] = React.useState(false);
  const backendApi = React.useContext(BackendApiContext);

  return (
    <Box>
      <IconButton
        aria-label="delete"
        onClick={() => setOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <ConfirmDialog
        title="Delete User"
        message={`Are you sure you want to delete user ${username}?`}
        open={open}
        setOpen={setOpen}
        confirmOnClick={async () => {
          setOpen(false);
          try {
            await backendApi.deleteUser(email);
          } catch (statusCode: any) {
            setError("Something went wrong when trying to delete the user");
          } finally {
            setUsersRefresh((val) => !val);
          }
        }}
      />
    </Box>
  )
}
