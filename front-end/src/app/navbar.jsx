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
import LogoutIcon from '@mui/icons-material/Logout';
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
        setTabs([{text:'Home',href:'/admin'},{text:'Grant Advance',href:'/admin/grantAdvance'},{text:'Add apartment',href:'/admin/addApartment'},{text:'Add Guard',href:'/admin/addGuard'},{text:'Add existing guard',href:'/admin/addExistingGuard'},{text:'Attendance',href:'/admin/attendance'},{text:'View Patrol',href:'/admin/patrol'},{text:'View Payroll',href:'/admin/payroll'}])
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
        <Toolbar className='bg-gradient-to-r from-[#884ff5] to-[#c4b2ff]' sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography className='font-mono font-black' variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Maestro Workforce
          </Typography>
          <LogoutIcon className='hover:text-red-600 hover:transform hover:scale-125 transition duration-300 ease-in-out'/>
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
        <Box className="bg-gradient-to-t from-[#BD72F7] to-[#D8B0F6] border-r-4 border-white min-h-full" sx={{ overflow: 'auto' }}>
          <List className='py-0'>
            {tabs.map((text) => (
              <ListItem className={(pathname == text.href)?"bg-[#7f13eb] scale-110 border-b-2 border-white":"border-b-2 border-white"} key={text} disablePadding>
                <ListItemButton >
                  <ListItemText  primary={(<a className={(pathname == text.href)?"text-white font-black min-w-full":"font-black min-w-full"} href={text.href} variant="text"><div className='text-center hover:transform hover:scale-125 transition duration-300 ease-in-out'>{text.text}</div></a>)} />
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