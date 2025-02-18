import Box from "@mui/material/Box";
import TopBar from "../components/Topbar";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import React from "react";
import { Grid2 } from "@mui/material";

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
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </Box>
    </Box>
  )
}

function UserSettings() {
  <Grid2
    direction="row"
  ></Grid2>
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
