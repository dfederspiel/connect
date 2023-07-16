import { useSubscription } from '@apollo/client';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from '../pages/Home';
import User from '../components/User';
import { useSnacks } from '../context/AlertContext/SnackBarProvider';
import { AffirmationGivenSubscriptionDocument } from '../gql/graphql';
import {
  AppBar,
  Container,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';

const AppView = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const snacks = useSnacks();

  useSubscription(AffirmationGivenSubscriptionDocument, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData);
      snacks.updateMessage('Affirmation Given!!');
    },
  });

  return (
    <Container>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleClick}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Connect
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        style={{
          marginTop: '80px',
        }}
      >
        <Router>
          <Drawer anchor="left" open={open} onClose={handleClose}>
            <List>
              <ListItem
                aria-label="menu close"
                button
                onClick={handleClose}
                component={Link}
                to="/"
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem component={User} />
            </List>
          </Drawer>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </Grid>
      <Typography style={{ textAlign: 'center' }}>
        Connect © 2023 created by David Federspiel
      </Typography>
    </Container>
  );
};

export default AppView;
