import Box from "@mui/material/Box";
import TopBar from "../components/Topbar";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import useTheme from "@mui/material/styles/useTheme";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import React from "react";
import UserSettings from "../components/UserSettings";
import StorageInfo from "../components/StorageStats";

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
            <Tab label="Data" icon={<SaveAsIcon />} />
            <Tab label="Users" icon={<ManageAccountsIcon />} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <StorageInfo />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <UserSettings />
        </TabPanel>
      </Box>
    </Box>
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
        key={value}
        {...other}
      >
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </div>
    );
  }
}
