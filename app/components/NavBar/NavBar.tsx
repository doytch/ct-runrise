import { Category } from '@commercetools/platform-sdk';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { Form, Link, useSearchParams } from 'remix';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const NavBar = ({ categories }: { categories: Array<Category> }): JSX.Element => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerIsOpen(false), []);
  const openDrawer = useCallback(() => setDrawerIsOpen(true), []);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          color="inherit"
          edge="start"
          onClick={openDrawer}
          size="large"
          sx={{ mr: 2 }}
        >
          <MenuIcon />{' '}
        </IconButton>
        <Drawer anchor="left" onClose={closeDrawer} open={drawerIsOpen}>
          <Box
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
            role="presentation"
            sx={{ width: 250 }}
          >
            <List>
              <ListItemButton>
                <ListItemText primary="Close" />
              </ListItemButton>
              <Divider />
              <Form action={`/products${searchParam && `?search=${searchParam}`}`} method="get">
                {categories.map(c => (
                  <ListItemButton
                    key={c.key}
                    aria-label={`${c.name}`}
                    component="button"
                    name="category"
                    style={{ width: '100%' }}
                    type="submit"
                    value={c.id}
                  >
                    <ListItemText primary={c.name} />
                  </ListItemButton>
                ))}
              </Form>
            </List>
          </Box>
        </Drawer>
        <Typography
          component="div"
          noWrap
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          variant="h6"
        >
          <Link style={{ color: '#fff', textDecoration: 'none' }} to="/">
            remix.runrise
          </Link>
        </Typography>
        <Form action={`/products${categoryParam && `?category=${categoryParam}`}`} method="get">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              defaultValue={searchParams.get('search') ?? undefined}
              inputProps={{ 'aria-label': 'search' }}
              name="search"
              placeholder="Search..."
            />
          </Search>
        </Form>
      </Toolbar>
    </AppBar>
  );
};
