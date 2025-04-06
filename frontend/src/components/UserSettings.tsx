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
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import { BackendApiContext } from "../App";

export default function UserSettings() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [userSettingsError, setUserSettingsError] = React.useState("");
  const backendApi = useContext(BackendApiContext);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users: User[] = await backendApi.getUsers();
        setUsers(users);
      } catch (err: any) {
        setUserSettingsError(err);
      }
    }

    fetchUsers()
  }, []);

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      width="80vw"
    >
      {
        (userSettingsError.length > 0) && <Alert severity="error" variant="filled" sx={{ m: 5 }}>{userSettingsError}</Alert>
      }
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
          <CreateUserForm />
        </AccordionDetails>
      </Accordion>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Email Address</Box></Typography></TableCell>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Username</Box></Typography></TableCell>
              <TableCell><Typography><Box sx={{ fontWeight: "bold" }}>Account Type</Box></Typography></TableCell>
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
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2 >
  )
}
