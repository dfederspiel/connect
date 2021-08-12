import { useSubscription } from '@apollo/client';
import {
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import { useState } from 'react';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { useSnacks } from '../context/AlertContext/SnackBarProvider';
import { AFFIRMATION_GIVEN_SUBSCRIPTION } from '../graphql/subscriptions';
import HomePage from '../pages/Home';
import User from '../components/User';

const AppView = () => {
  const [open, setOpen] = useState(false);

  const handleClick = (event: any) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const snacks = useSnacks();

  useSubscription(AFFIRMATION_GIVEN_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
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
              <ListItem button onClick={handleClose} component={Link} to="/">
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem component={User} />
            </List>
          </Drawer>
          <Switch>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </Grid>
      <Typography style={{ textAlign: 'center' }}>
        connect © 2020 created by david federspiel
      </Typography>
    </Container>
  );
};

export default AppView;
