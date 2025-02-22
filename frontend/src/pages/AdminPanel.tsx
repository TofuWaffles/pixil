import Box from "@mui/material/Box";
import TopBar from "../components/Topbar";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useTheme from "@mui/material/styles/useTheme";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import React from "react";
import { User } from "../types/props";
import Grid2 from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";

export default function AdminPanel() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <TopBar title="Administrator Settings" />
      <Box sx={{ bgcolor: theme.palette.primary.light, width: "100%" }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              bgcolor: theme.palette.primary.dark
            }}
          >
            <Tab label="System" icon={<SettingsApplicationsIcon />} />
            <Tab label="Users" icon={<ManageAccountsIcon />} />
            <Tab label="Data" icon={<SaveAsIcon />} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <UserSettings />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </Box>
    </Box>
  )
}

function UserSettings() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [userSettingsError, setUserSettingsError] = React.useState("");

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await fetch(import.meta.env.VITE_BACKEND_URL + `/user`);
        if (!usersResponse.ok) {
          throw new Error(`Error fetching users: ${usersResponse.statusText}`);
        }

        const users: User[] = await usersResponse.json();
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
        </AccordionDetails>
      </Accordion>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email Address</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Account Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              users.map((user) => (
                <TableRow
                  key={user.email}
                >
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2 >
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  if (value === index) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        className="flex h-lvh w-screen justify-center"
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
}
