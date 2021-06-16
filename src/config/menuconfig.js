import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import ApartmentSharpIcon from "@material-ui/icons/ApartmentSharp";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import AttachMoneySharpIcon from "@material-ui/icons/AttachMoneySharp";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import DescriptionIcon from "@material-ui/icons/Description";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import HomeSharpIcon from "@material-ui/icons/HomeSharp";
import LocalGroceryStoreIcon from "@material-ui/icons/LocalGroceryStore";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import PeopleIcon from "@material-ui/icons/People";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import PersonIcon from "@material-ui/icons/Person";
import StarBorder from "@material-ui/icons/StarBorder";
import StoreMallDirectorySharpIcon from "@material-ui/icons/StoreMallDirectorySharp";
import React from "react";
import { GiTeacher } from "react-icons/gi";
import { buildMapPathMenu } from "../utils/MenuUtils";
import { backlog } from "./menuconfig/backlog";
import { eduLearningManagement } from "./menuconfig/classmanagement/student";
import { eduTeachingManagement } from "./menuconfig/classmanagement/teacher";
import { customer } from "./menuconfig/customer";
import { department } from "./menuconfig/department";
import { distributor } from "./menuconfig/distributor";
import { facilityreport } from "./menuconfig/facilityreport";
import { general } from "./menuconfig/general";
import { invoice } from "./menuconfig/invoice";
import { map } from "./menuconfig/map";
import { order } from "./menuconfig/order";
import { post } from "./menuconfig/post";
import { product } from "./menuconfig/product";
import { productprice } from "./menuconfig/productprice";
import { productpricesupplier } from "./menuconfig/productpricesupplier";
import { promotax } from "./menuconfig/promotax";
import { purchaseorder } from "./menuconfig/purchaseorder";
import { retailoutlet } from "./menuconfig/retailoutlet";
import { saleman } from "./menuconfig/saleman";
import { salereport } from "./menuconfig/salereport";
import { salesroute } from "./menuconfig/salesroute";
import { schedule } from "./menuconfig/schedule";
import { supplier } from "./menuconfig/supplier";
import { teachingassignment } from "./menuconfig/teachingassignment";
import { tms } from "./menuconfig/tms";
import { tmscontainer } from "./menuconfig/tmscontainer";
import { tmsreport } from "./menuconfig/tmsreport";
import { transport } from "./menuconfig/transport";
import { unpaidinvoice } from "./menuconfig/unpaidinvoice";
import { user } from "./menuconfig/user";
import { warehouse } from "./menuconfig/warehouse";
import { lake_mgr } from "./menuconfig/water-resources-management/lakemanagement";
import { webcam } from "./menuconfig/webcam";

export const MENU_LIST = [];
MENU_LIST.push(general);
MENU_LIST.push(eduTeachingManagement);
MENU_LIST.push(eduLearningManagement);
MENU_LIST.push(teachingassignment);
MENU_LIST.push(schedule);
MENU_LIST.push(department);
MENU_LIST.push(tms);
MENU_LIST.push(user);
MENU_LIST.push(order);
MENU_LIST.push(promotax);
MENU_LIST.push(invoice);
MENU_LIST.push(unpaidinvoice);
MENU_LIST.push(salesroute);
MENU_LIST.push(supplier);
MENU_LIST.push(purchaseorder);
MENU_LIST.push(productpricesupplier);
MENU_LIST.push(warehouse);
MENU_LIST.push(transport);
MENU_LIST.push(post);
MENU_LIST.push(product);
MENU_LIST.push(customer);
MENU_LIST.push(retailoutlet);
MENU_LIST.push(saleman);
MENU_LIST.push(distributor);
MENU_LIST.push(productprice);
MENU_LIST.push(map);
MENU_LIST.push(salereport);
MENU_LIST.push(facilityreport);
MENU_LIST.push(tmsreport);
MENU_LIST.push(tmscontainer);
MENU_LIST.push(webcam);
MENU_LIST.push(backlog);
MENU_LIST.push(lake_mgr);

export const menuIconMap = new Map();
menuIconMap.set("DashboardIcon", <DashboardRoundedIcon />);
menuIconMap.set("InboxIcon", <InboxIcon />);
menuIconMap.set("StarBorder", <StarBorder />);
menuIconMap.set("PeopleIcon", <PeopleIcon />);
menuIconMap.set("AirportShuttleIcon", <AirportShuttleIcon />);
menuIconMap.set("PeopleOutlineIcon", <PeopleOutlineIcon />);
menuIconMap.set("PersonIcon", <PersonIcon />);
menuIconMap.set("FormatListNumberedIcon", <FormatListNumberedIcon />);
menuIconMap.set("DescriptionIcon", <DescriptionIcon />);
menuIconMap.set("DescriptionOutlinedIcon", <DescriptionOutlinedIcon />);
menuIconMap.set("ApartmentSharpIcon", <ApartmentSharpIcon />);
menuIconMap.set("AttachMoneySharpIcon", <AttachMoneySharpIcon />);
menuIconMap.set("StoreMallDirectorySharpIcon", <StoreMallDirectorySharpIcon />);
menuIconMap.set("HomeSharpIcon", <HomeSharpIcon />);
menuIconMap.set("FastfoodIcon", <FastfoodIcon />);
menuIconMap.set("LocalGroceryStoreIcon", <LocalGroceryStoreIcon />);
menuIconMap.set("BlurOnIcon", <BlurOnIcon />);
menuIconMap.set("GiTeacher", <GiTeacher size={24} />);
menuIconMap.set("LocalLibraryIcon", <LocalLibraryIcon />);
menuIconMap.set("AssignmentOutlinedIcon", <AssignmentOutlinedIcon />);

export const mapPathMenu = buildMapPathMenu(MENU_LIST);
