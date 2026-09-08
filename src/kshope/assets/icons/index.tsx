// src/components/icons/CustomIcons.tsx
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialDesignIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colours';

interface IconProps {
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

const defaultSize = 24;

// Icon components with default props
const Home = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="home-outline" size={size} color={color} style={style} />
);

const User = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="user" size={size} color={color} style={style} />
);

const Delete = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="delete" size={size} color={color} style={style} />
);

const Group = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="group" size={size} color={color} style={style} />
);

const PeopleCarry = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome5 name="people-carry" size={size} color={color} style={style} />
);

const Back = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="chevron-back" size={size} color={color} style={style} />
);

const Settings = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Feather name="settings" size={size} color={color} style={style} />
);

const Add = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="add" size={size} color={color} style={style} />
);

const Remove = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="remove" size={size} color={color} style={style} />
);



const Menu = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="menu" size={size} color={color} style={style} />
);

const Forward = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="chevron-forward" size={size} color={color} style={style} />
);

const Person = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="person" size={size} color={color} style={style} />
);

const CheckMark = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="checkmark" size={size} color={color} style={style} />
);

const ArrowDown = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="keyboard-arrow-down" size={size} color={color} style={style} />
);

const ArrowUp = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="keyboard-arrow-up" size={size} color={color} style={style} />
);

const Search = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="search" size={size} color={color} style={style} />
);

const Close = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="close" size={size} color={color} style={style} />
);

const GiftCard = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="gift-outline" size={size} color={color} style={style} />
);

const CouponTicket = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="ticket-confirmation-outline" size={size} color={color} style={style} />
);

const ShoppingCart = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="shopping-cart" size={size} color={color} style={style} />
);

const ViewModule = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="view-module" size={size} color={color} style={style} />
);

const ViewList = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="view-list" size={size} color={color} style={style} />
);

const Check = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="check" size={size} color={color} style={style} />
);

const ArrowLeft = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="arrow-back" size={size} color={color} style={style} />
);

const ChevronDown = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Feather name="chevron-down" size={size} color={color} style={style} />
);

const ChevronRight = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Entypo name="chevron-right" size={size} color={color} style={style} />
);

const History = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="history" size={size} color={color} style={style} />
);
const NavIcon = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="navicon" size={size} color={color} style={style} />
);

const Phone = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="phone" size={size} color={color} style={style} />
);

const Email = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="email" size={size} color={color} style={style} />
);

const Filter = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="filter-list" size={size} color={color} style={style} />
);

const Edit = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="edit" size={size} color={color} style={style} />
);

const X = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="close" size={size} color={color} style={style} />
);

const Food = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="food" size={size} color={color} style={style} />
);

const CreditCard = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="credit-card" size={size} color={color} style={style} />
);

const UserCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="user-circle" size={size} color={color} style={style} />
);

const Calendar = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="calendar-today" size={size} color={color} style={style} />
);

const Users = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome5 name="users" size={size} color={color} style={style} />
);

const EyeOpen = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="eye" size={size} color={color} style={style} />
);

const EyeClose = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="eye-off" size={size} color={color} style={style} />
);

const HeartOutline = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="heart-outline" size={size} color={color} style={style} />
);

const Bookmark = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="bookmark" size={size} color={color} style={style} />
);

const Star = ({ size = defaultSize, color = '#FFD700', style }: IconProps) => (
    <FontAwesome name="star" size={size} color={color} style={style} />
);

const StarOutline = ({ size = defaultSize, color = '#DADADA', style }: IconProps) => (
    <FontAwesome name="star-o" size={size} color={color} style={style} />
);

const Cart = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="shopping-cart" size={size} color={color} style={style} />
);
const Bag = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="bag-outline" size={size} color={color} style={style} />
);
const Bell = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialDesignIcons name="bell-outline" size={size} color={color} style={style} />
);

const Microphone = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="microphone" size={size} color={color} style={style} />
);

const BookmarkOutline = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Fontisto name="bookmark" size={size} color={color} style={style} />
);

const BookmarkFilled = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Fontisto name="bookmark-alt" size={size} color={color} style={style} />
);

const TrippleRight = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialDesignIcons name="chevron-triple-right" size={size} color={color} style={style} />
);


const RightArrow = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Entypo name="chevron-thin-right" size={size} color={color} style={style} />
);


const FilterIcon = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="options-outline" size={size} color={color} style={style} />
);

const Reload = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="reload" size={size} color={color} style={style} />
);

const Lock = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="lock" size={size} color={color} style={style} />
);

const Invoice = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="receipt-text-outline" size={size} color={color} style={style} />
);

const PaymentCard = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="credit-card-outline" size={size} color={color} style={style} />
);

const CheckCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="check-decagram" size={size} color={color} style={style} />
);

const ReturnArrow = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="backup-restore" size={size} color={color} style={style} />
);

const ArrowRightCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="arrow-forward" size={size} color={color} style={style} />
);

const Cash = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="cash-multiple" size={size} color={color} style={style} />
);

const Location = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="location-sharp" size={size} color={color} style={style} />
);

const ArrowUpBold = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Entypo name="arrow-bold-up" size={size} color={color} style={style} />
);

const ArrowDownBold = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Entypo name="arrow-bold-down" size={size} color={color} style={style} />
);

const ArrowBack = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="arrow-back" size={size} color={color} style={style} />
);






// Exporting all as object for named JSX usage
export const AppIcons = {
    Home,
    User,
    Delete,
    Back,
    Settings,
    Add,
    Remove,
    Menu,
    Forward,
    Person,
    CheckMark,
    Group,
    ArrowDown,
    ArrowUp,
    Search,
    Close,
    ShoppingCart,
    GiftCard,
    CouponTicket,
    ViewModule,
    ViewList,
    Check,
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    History,
    NavIcon,
    Phone,
    Email,
    Filter,
    X,
    Food,
    PeopleCarry,
    CreditCard,
    UserCircle,
    Calendar,
    Edit,
    Users,
    EyeOpen,
    EyeClose,
    Bookmark,
    Star,
    StarOutline,
    Cart,
    HeartOutline,
    Bag,
    Bell,
    Microphone,
    BookmarkFilled,
    BookmarkOutline,
    TrippleRight,
    RightArrow,
    FilterIcon,
    Reload,
    Lock,
    Cash,
    Location,
    ArrowUpBold,
    ArrowDownBold,
    ArrowBack,
    Invoice,
    PaymentCard,
    CheckCircle,
    ReturnArrow,
    ArrowRightCircle
};
