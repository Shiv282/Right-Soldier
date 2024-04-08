"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Button } from '@mui/material';
import { useEffect, useState } from "react";
import "./globals.css";

import { usePathname } from "next/navigation";

const drawerWidth = 240;

export default function NavBar({children}) {
    const [tabs,setTabs] = useState(['Inbox', 'Starred', 'Send email', 'Drafts']);
    const [activeProfile, setActiveProfile] = useState('');
    const pathname = usePathname();
    if(!(activeProfile == 'admin') && pathname.includes("admin")){
        setActiveProfile('admin');
        setTabs([{text:'Home',href:'/admin'},{text:'Grant Advance',href:''},{text:'Add apartment',href:''},{text:'Add Guard',href:''},{text:'Add existing guard',href:''},{text:'Attendance',href:''},{text:'View Patrol',href:''},{text:'View Payroll',href:''}])
    }else if(!(activeProfile == 'supervisor') && pathname.includes("supervisor")){
        setActiveProfile('supervisor');
        setTabs([{text:'Home',href:'/supervisor'},{text:'Mark Attendance',href:'/supervisor/markAttendance'},{text:'View attendance',href:'/supervisor/viewAttendance'},{text:'Start patrol',href:'/supervisor/startPatrol'},{text:'View my patrols',href:'/supervisor/myPatrols'},{text:'Apartment patrols',href:'/supervisor/viewApartmentPatrol'}]);
    }else if(!(activeProfile == 'guard') && pathname.includes("guard")){
        setActiveProfile('guard');
        setTabs([{text:'Home',href:'/guard'},{text:'Start patrol',href:'/guard/startPatrol'},{text:'View my patrols',href:'/guard/myPatrols'}]);
    }
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar className='bg-slate-700'>
          <Typography variant="h6" noWrap component="div">
            Maestro Workforce
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
        
      >
        <Toolbar  />
        <Box className="bg-slate-500 border-r-8 border-white min-h-full" sx={{ overflow: 'auto' }}>
          <List className='py-0'>
            {tabs.map((text) => (
              <ListItem className={(pathname == text.href)?"bg-slate-900 border-b-2 border-slate-900":"border-b-2 border-slate-900"} key={text} disablePadding>
                <ListItemButton >
                  <ListItemText  primary={(<Button className="text-white min-w-full" href={text.href} variant="text">{text.text}</Button>)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}