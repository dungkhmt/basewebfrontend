import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {useTheme} from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import StarBorder from "@material-ui/icons/StarBorder";
import clsx from "clsx";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PeopleIcon from "@material-ui/icons/People";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import PersonIcon from "@material-ui/icons/Person";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import DescriptionIcon from "@material-ui/icons/Description";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import ApartmentSharpIcon from "@material-ui/icons/ApartmentSharp";
import AttachMoneySharpIcon from "@material-ui/icons/AttachMoneySharp";
import StoreMallDirectorySharpIcon from "@material-ui/icons/StoreMallDirectorySharp";
import HomeSharpIcon from "@material-ui/icons/HomeSharp";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import LocalGroceryStoreIcon from "@material-ui/icons/LocalGroceryStore";

import BlurOnIcon from "@material-ui/icons/BlurOn";

const drawerWidth = 340;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: 0,
    [theme.breakpoints.up("sm")]: {
      width: 0,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));
export default function SideBar(props) {
  const open = props.open;
  const handleDrawerClose = props.handleDrawerClose;
  const theme = useTheme();
  const classes = useStyles();
  const [openCollapse,] = React.useState(new Set()); // thiet lap 4 menu TO
  const [, rerender] = useState([]);
  const handleListClick = key => {
    // let tmp = [...openCollapse];
    // tmp[i] = !tmp[i];
    // setOpenCollapse(tmp);
    if (openCollapse.has(key)) {
      openCollapse.delete(key);
    } else {
      openCollapse.add(key);
    }
    rerender([]);
  };

  // const logo = require('../favicon.ico');

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        {/*<img src={logo} height={25} width={25}/>*/}
        {/*<h2>{'Daily Opt'}</h2>*/}
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon/>
          ) : (
            <ChevronLeftIcon/>
          )}
        </IconButton>
      </div>
      <Divider/>
      <List>
        {props.menu.has("MENU_DEPARTMENT") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_DEPARTMENT')}>
              <ListItemIcon>
                <BlurOnIcon/>
              </ListItemIcon>
              <ListItemText primary="Quản lý phòng ban"/>
              {openCollapse.has('MENU_DEPARTMENT') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_DEPARTMENT')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/departments/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS phòng ban"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_TMS") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_TMS')}>
              <ListItemIcon>
                <BlurOnIcon/>
              </ListItemIcon>
              <ListItemText primary="Kiểm soát lộ trình"/>
              {openCollapse.has('MENU_TMS') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_TMS')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/tracklocations/gismap"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Bản đồ"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link} // props
                  to={process.env.PUBLIC_URL + "/tracklocations/list"} // props
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_USER") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_USER')}>
              <ListItemIcon>
                <PersonIcon/>
              </ListItemIcon>
              <ListItemText primary="Tài khoản"/>
              {openCollapse.has('MENU_USER') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_USER')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_USER_CREATE") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/userlogin/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới"/>
                  </ListItem>
                ) : (
                  ""
                )}
                {props.menu.has("MENU_USER_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/userlogin/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}
        {props.menu.has("MENU_ORDER") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_ORDER')}>
              <ListItemIcon>
                <DescriptionOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="Đơn hàng"/>
              {openCollapse.has('MENU_ORDER') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_ORDER')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_ORDER_CREATE") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/orders/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới"/>
                  </ListItem>
                ) : (
                  ""
                )}
                {props.menu.has("MENU_ORDER_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/orders/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="DS Đơn Hàng"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_INVOICE") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_INVOICE')}>
              <ListItemIcon>
                <DescriptionIcon/>
              </ListItemIcon>
              <ListItemText primary="Hóa đơn"/>
              {openCollapse.has('MENU_INVOICE') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_INVOICE')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_INVOICE_CREATE") ? (
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_INVOICE_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/invoice-sales/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="DS hóa đơn thu"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_INVOICE_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/customer-payment/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="DS KH thanh toán"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>

            <ListItem button onClick={() => handleListClick('MENU_UNPAID_INVOICE')}>
              <ListItemIcon>
                <DescriptionIcon/>
              </ListItemIcon>
              <ListItemText primary="Báo cáo công nợ"/>
              {openCollapse.has('MENU_UNPAID_INVOICE') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_UNPAID_INVOICE')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/distributor-unpaid-invoice/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Công nợ của nhà phân phối"/>
                  </ListItem>
                }

                {
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/retail-outlet-unpaid-invoice/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Công nợ của đại lí bán lẻ"/>
                  </ListItem>
                }
              </List>
            </Collapse>

          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_SALES_ROUTE") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_SALES_ROUTE')}>
              <ListItemIcon>
                <LocalGroceryStoreIcon/>
              </ListItemIcon>
              <ListItemText primary="Tuyến bán hàng"/>
              {openCollapse.has('MENU_SALES_ROUTE') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_SALES_ROUTE')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/salesman/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách NVBH"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/salesman/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Tạo mới NVBH"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách khách hàng"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Kế hoạch tuyến"/>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Cấu hình tuyến"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Chi tiết tuyến"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/salesroutes/salesman-checkin-routes"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Lịch sử check-in tuyến"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        <div>
          <ListItem button onClick={() => handleListClick('MENU_SUPPLIER')}>
            <ListItemIcon>
              <HomeSharpIcon/>
            </ListItemIcon>
            <ListItemText primary="QL nhà cung cấp"/>
            {openCollapse.has('MENU_SUPPLIER') ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>
          <Collapse in={openCollapse.has('MENU_SUPPLIER')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItem button className={classes.nested} component={Link}
                        to={process.env.PUBLIC_URL + '/supplier/list'}>
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS nhà cung cấp"/>
              </ListItem>


              <ListItem button className={classes.nested} component={Link}
                        component={Link}
                        to={process.env.PUBLIC_URL + "/supplier/create"}
              >
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="Tạo mới nhà cung cấp"/>
              </ListItem>

            </List>
          </Collapse>
        </div>

        <div>
          <ListItem button onClick={() => handleListClick('MENU_PURCHASE_ORDER')}>
            <ListItemIcon>
              <HomeSharpIcon/>
            </ListItemIcon>
            <ListItemText primary="Mua hàng"/>
            {openCollapse.has('MENU_PURCHASE_ORDER') ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>
          <Collapse in={openCollapse.has('MENU_PURCHASE_ORDER')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItem button className={classes.nested} component={Link}
                        to={process.env.PUBLIC_URL + '/purchase-order/list'}>
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS đơn mua"/>
              </ListItem>


              <ListItem button className={classes.nested} component={Link}
                        component={Link}
                        to={process.env.PUBLIC_URL + "/supplier/list"}
              >
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS nhà cung cấp"/>
              </ListItem>

            </List>
          </Collapse>
        </div>

        <div>
          <ListItem button onClick={() => handleListClick('MENU_PRODUCT_PRICE_SUPPLIER')}>
            <ListItemIcon>
              <HomeSharpIcon/>
            </ListItemIcon>
            <ListItemText primary="Giá Mua hàng"/>
            {openCollapse.has('MENU_PRODUCT_PRICE_SUPPLIER') ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>
          <Collapse in={openCollapse.has('MENU_PRODUCT_PRICE_SUPPLIER')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItem button className={classes.nested} component={Link}
                        to={process.env.PUBLIC_URL + '/product-price-supplier/list'}>
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS giá mua"/>
              </ListItem>
            </List>
          </Collapse>
        </div>


        {props.menu.has("MENU_WAREHOUSE") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_WAREHOUSE')}>
              <ListItemIcon>
                <HomeSharpIcon/>
              </ListItemIcon>
              <ListItemText primary="QL Kho"/>
              {openCollapse.has('MENU_WAREHOUSE') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_WAREHOUSE')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_WAREHOUSE_IMPORT") ? (
                  <ListItem button className={classes.nested} component={Link}
                            to={process.env.PUBLIC_URL + '/inventory/import'}>
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Nhập kho"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_WAREHOUSE_EXPORT") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/inventory/order"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Xuất kho"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_WAREHOUSE_INVENTORY_ITEM") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/inventory/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="QL tồn kho"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_TMS") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_TRANSPORT')}>
              <ListItemIcon>
                <AirportShuttleIcon/>
              </ListItemIcon>
              <ListItemText primary="QL Vận chuyển"/>
              {openCollapse.has('MENU_TRANSPORT') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_TRANSPORT')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/vehicle"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS Xe"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/driver/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Tạo mới Tài xế"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/driver/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS Tài xế"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS khách hàng"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/shipment"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS đơn hàng vận chuyển"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/delivery-plan/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Tạo mới đợt giao hàng"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/delivery-plan-list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS đợt giao hàng"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Lập kế hoạch giao hàng"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/solver-config-param"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Cấu hình bộ giải"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_TMS") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_POST')}>
              <ListItemIcon>
                <ApartmentSharpIcon/>
              </ListItemIcon>
              <ListItemText primary="QL chuyển phát bưu kiện"/>
              {openCollapse.has('MENU_POST') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_POST')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  //to={process.env.PUBLIC_URL + "/vehicle"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS phương tiện"/>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS khách hàng"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/postoffice/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS bưu cục"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS đơn hàng chuyển phát"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  //to={process.env.PUBLIC_URL + "/delivery-plan/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Tạo mới đợt chuyển phát"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  //to={process.env.PUBLIC_URL + "/delivery-plan-list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS đợt chuyển phát"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Lập kế hoạch thu gom bưu kiện"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Lập kế hoạch phát bưu kiện"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_PRODUCT") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_PRODUCT')}>
              <ListItemIcon>
                <FastfoodIcon/>
              </ListItemIcon>
              <ListItemText primary="QL sản phẩm"/>
              {openCollapse.has('MENU_PRODUCT') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_PRODUCT')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_PRODUCT_CREATE") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/products/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới sản phẩm"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_PRODUCT_VIEW") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/products/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách SP"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_CUSTOMER") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_CUSTOMER')}>
              <ListItemIcon>
                <PeopleOutlineIcon/>
              </ListItemIcon>
              <ListItemText primary="QL Khách hàng"/>
              {openCollapse.has('MENU_CUSTOMER') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_CUSTOMER')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_CUSTOMER_CREATE") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/customer/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới KH"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_CUSTOMER_VIEW") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/customer/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách KH"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_RETAIL_OUTLET") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_RETAIL_OUTLET')}>
              <ListItemIcon>
                <StoreMallDirectorySharpIcon/>
              </ListItemIcon>
              <ListItemText primary="QL đại lí bán lẻ"/>
              {openCollapse.has('MENU_RETAIL_OUTLET') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_RETAIL_OUTLET')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_CREATE_RETAIL_OUTLET") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/retailoutlet/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới ĐLBL"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_VIEW_RETAIL_OUTLET") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/retailoutlet/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách ĐLBL"/>
                  </ListItem>
                ) : (
                  ""
                )}
                {props.menu.has("MENU_VIEW_ALL_RETAIL_OUTLET") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/retailoutlet/listall"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách tất cả ĐLBL"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}
        {props.menu.has("MENU_USER") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_USER')}>
              <ListItemIcon>
                <PeopleIcon/>
              </ListItemIcon>
              <ListItemText primary="QL nhân viên bán hàng"/>
              {openCollapse.has('MENU_USER') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_USER')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_USER_CREATE") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/salesman/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới NVBH"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_USER_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/salesman/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách NVBH"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_USER_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={
                      process.env.PUBLIC_URL +
                      "/salesman/assign-salesman-2-distributor"
                    }
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Phân công NVBH cho NPP"/>
                  </ListItem>
                ) : (
                  ""
                )}
                {props.menu.has("MENU_USER_LIST") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={
                      process.env.PUBLIC_URL +
                      "/salesman/assign-salesman-2-retail-outlet"
                    }
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Phân công NVBH phụ trách ĐLBL"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_DISTRIBUTOR") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_DISTRIBUTOR')}>
              <ListItemIcon>
                <ApartmentSharpIcon/>
              </ListItemIcon>
              <ListItemText primary="QL Nhà Phân Phối"/>
              {openCollapse.has('MENU_DISTRIBUTOR') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_DISTRIBUTOR')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_CREATE_DISTRIBUTOR") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/distributor/create"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Tạo mới NPP"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_VIEW_DISTRIBUTOR") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/distributor/list"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách NPP"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_VIEW_ALL_DISTRIBUTOR") ? (
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to={process.env.PUBLIC_URL + "/distributor/listall"}
                  >
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách tất cả NPP"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}
        {props.menu.has("MENU_PRODUCT") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_PRODUCT_PRICE')}>
              <ListItemIcon>
                <AttachMoneySharpIcon/>
              </ListItemIcon>
              <ListItemText primary="QL giá sản phẩm"/>
              {openCollapse.has('MENU_PRODUCT_PRICE') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_PRODUCT_PRICE')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.menu.has("MENU_PRODUCT_PRICE_CREATE") ? (
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Thiết lập giá sản phẩm"/>
                  </ListItem>
                ) : (
                  ""
                )}

                {props.menu.has("MENU_PRODUCT_VIEW") ? (
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder/>
                    </ListItemIcon>
                    <ListItemText primary="Danh sách SP"/>
                  </ListItem>
                ) : (
                  ""
                )}
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_TMS") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_MAP')}>
              <ListItemIcon>
                <InboxIcon/>
              </ListItemIcon>
              <ListItemText primary="QL vị trí, địa chỉ trên bản đồ"/>
              {openCollapse.has('MENU_MAP') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_MAP')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/geo/list/location"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách vị trí"/>
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/geo/list/distance-info"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách khoảng cách"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_SALES_REPORT") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_SALES_REPORT')}>
              <ListItemIcon>
                <FormatListNumberedIcon/>
              </ListItemIcon>
              <ListItemText primary="Báo cáo bán hàng"/>
              {openCollapse.has('MENU_SALES_REPORT') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_SALES_REPORT')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/sale-reports-by-date"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Doanh số theo ngày"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/sale-reports-by-customer"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Doanh số theo khách hàng"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Doanh số theo nhà phân phối"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Doanh số theo nhân viên bán hàng"/>
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/sale-reports-by-product"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Doanh số theo sản phẩm"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_FACILITY_REPORT") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_FACILITY_REPORT')}>
              <ListItemIcon>
                <FormatListNumberedIcon/>
                <HomeSharpIcon/>
              </ListItemIcon>
              <ListItemText primary="Báo cáo kho"/>
              {openCollapse.has('MENU_FACILITY_REPORT') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_FACILITY_REPORT')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Báo cáo tồn kho"/>
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Xuất kho"/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Nhập kho"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_TMS_REPORT") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_TMS_REPORT')}>
              <ListItemIcon>
                <FormatListNumberedIcon/>
                <AirportShuttleIcon/>
              </ListItemIcon>
              <ListItemText primary="Báo cáo vận chuyển"/>
              {openCollapse.has('MENU_TMS_REPORT') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCollapse.has('MENU_TMS_REPORT')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/transport-reports-by-driver"}
                >
                  >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Báo cáo chuyến theo tài xế"/>
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/transport-reports-by-customer"}
                >
                  >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Báo cáo chuyến theo KH"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/transport-reports-by-facility"}
                >
                  >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Báo cáo chuyến theo kho"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}

        {props.menu.has("MENU_TMS_CONTAINER") ? (
          <div>
            <ListItem button onClick={() => handleListClick('MENU_TMS_CONTAINER')}>
              <ListItemIcon>
                <FormatListNumberedIcon/>
                <AirportShuttleIcon/>
              </ListItemIcon>
              <ListItemText primary="Vận chuyển container"/>
              {openCollapse.has('MENU_TMS_CONTAINER') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={openCollapse.has('MENU_TMS_CONTAINER')} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/portfunc/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới bến cảng "/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/portfunc/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách bến cảng "/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/depottruckfunc/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới bãi đầu kéo "/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/depottruckfunc/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS bãi đầu kéo"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/depottrailerfunc/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới bãi mooc"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/depottrailerfunc/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS bãi rơ mooc"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/depotcontainerfunc/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới bãi container"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/depotcontainerfunc/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS bãi container"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/containerfunc/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Tạo mới container"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/containerfunc/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS container"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/trailerfunc/create"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới rơ mooc"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={process.env.PUBLIC_URL + "/trailerfunc/list"}
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS rơ mooc"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/create-request-transport-container-empty"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm yêu cầu chuyển container rỗng từ kho về bãi"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/list-request-transport-container-empty"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách đơn vận chuyển container rỗng từ kho đến bãi "/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/create-request-transport-container-empty-export"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm yêu cầu chuyển container rỗng từ bãi về kho "/>
                </ListItem>
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/list-request-transport-container-empty-export"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách đơn vận chuyển container rỗng từ bãi đến kho "/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/create-request-transport-full-export"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới yêu cầu chuyển container đầy hàng từ kho ra cảng"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/list-request-transport-full-export"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách đơn vận chuyển container đầy hàng từ kho ra cảng "/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS đơn vận chuyển import empty"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/create-request-transport-container-to-warehouse"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Thêm mới yêu cầu vận chuyển container đến kho"/>
                </ListItem>

                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to={
                    process.env.PUBLIC_URL +
                    "/list-request-transport-container-to-warehouse"
                  }
                >
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="Danh sách đơn vận chuyển container đầy đến kho "/>
                </ListItem>

                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder/>
                  </ListItemIcon>
                  <ListItemText primary="DS đơn chuyển kho"/>
                </ListItem>
              </List>
            </Collapse>
          </div>
        ) : (
          ""
        )}


        <div>
          <ListItem button onClick={() => handleListClick('MENU_TEACHING_ASSIGNMENT')}>
            <ListItemIcon>
              <FormatListNumberedIcon/>
              <AirportShuttleIcon/>

            </ListItemIcon>
            <ListItemText primary="Phân công giảng dạy"/>
            {openCollapse.has('MENU_TEACHING_ASSIGNMENT') ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>


          <Collapse in={openCollapse.has('MENU_TEACHING_ASSIGNMENT')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              <ListItem
                button
                className={classes.nested}
                component={Link}
                to={process.env.PUBLIC_URL + ""}
              >
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS môn học"/>
              </ListItem>

              <ListItem
                button
                className={classes.nested}
                component={Link}
                to={process.env.PUBLIC_URL + ""}
              >
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS giáo viên"/>
              </ListItem>

              <ListItem
                button
                className={classes.nested}
                component={Link}
                to={process.env.PUBLIC_URL + ""}
              >
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS lớp"/>
              </ListItem>


              <ListItem
                button
                className={classes.nested}
                component={Link}
                to={process.env.PUBLIC_URL + ""}
              >
                <ListItemIcon>
                  <StarBorder/>
                </ListItemIcon>
                <ListItemText primary="DS phân công"/>
              </ListItem>


            </List>
          </Collapse>
        </div>


      </List>
    </Drawer>
  );
}
