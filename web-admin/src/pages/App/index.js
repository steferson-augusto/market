import React from "react"
import { Route, Link } from "react-router-dom"
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import TurnedInIcon from '@material-ui/icons/TurnedIn'
import CategoryIcon from '@material-ui/icons/Category'
import EmojiSymbolsIcon from '@material-ui/icons/EmojiSymbols'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import { routes } from "../../routes"

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}))

const menuList = [
    {
        label: 'Produtos',
        icon: <ShoppingBasketIcon />,
        to: '/products' ,
    },
    {
        label: 'Marcas',
        icon: <TurnedInIcon />,
        to: '/marks' ,
    },
    {
        label: 'Seções',
        icon: <CategoryIcon />,
        to: '/sections' ,
    },
    {
        label: 'Unidades de Medida',
        icon: <EmojiSymbolsIcon />,
        to: '/ums' ,
    },
]

const paths = {
    "/": "MARCAS",
    "/marks": 'MARCAS',
    '/sections': 'SEÇÕES',
    '/ums': 'UNIDADES DE MEDIDA',
    '/products': 'PRODUTOS',
}

const App = props => {
    // const user = useSelector(state => state.user)
    const classes = useStyles()
    const theme = useTheme()
    const [open, setOpen] = React.useState(false)
    const path = props.location.pathname

    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit" aria-label="open drawer"
                        onClick={handleDrawerOpen} edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        LOGO {` - ${paths[path]}`}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent" open={open}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open, [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({ [classes.drawerOpen]: open, [classes.drawerClose]: !open, }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {menuList.map((item, index) => (
                        <ListItem button key={`${index}`} component={Link} to={item.to}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                
                {routes.map(
                    (route, index) => 
                        <Route key={`${index}`} path={route.path} exact={route.exact} component={route.component}
                />)}
                
            </main>
        </div>
    )
}
export default App