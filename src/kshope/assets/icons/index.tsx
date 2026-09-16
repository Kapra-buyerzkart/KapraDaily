// src/components/icons/CustomIcons.tsx
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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

const Back = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="chevron-back" size={size} color={color} style={style} />
);

const Add = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="add" size={size} color={color} style={style} />
);

const Person = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="person" size={size} color={color} style={style} />
);

const CheckMark = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="checkmark" size={size} color={color} style={style} />
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

const Check = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="check" size={size} color={color} style={style} />
);

const ChevronDown = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Feather name="chevron-down" size={size} color={color} style={style} />
);

const Phone = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="phone" size={size} color={color} style={style} />
);

const Filter = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="filter-list" size={size} color={color} style={style} />
);

const UserCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <FontAwesome name="user-circle" size={size} color={color} style={style} />
);

const Calendar = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="calendar-today" size={size} color={color} style={style} />
);

const Bookmark = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="bookmark" size={size} color={color} style={style} />
);

const Star = ({ size = defaultSize, color = '#FFD700', style }: IconProps) => (
    <FontAwesome name="star" size={size} color={color} style={style} />
);

const Cart = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="shopping-cart" size={size} color={color} style={style} />
);

const HeartOutline = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="heart-outline" size={size} color={color} style={style} />
);

const Bell = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialDesignIcons name="bell-outline" size={size} color={color} style={style} />
);

const BookmarkOutline = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Fontisto name="bookmark" size={size} color={color} style={style} />
);

const BookmarkFilled = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Fontisto name="bookmark-alt" size={size} color={color} style={style} />
);

const Reload = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="reload" size={size} color={color} style={style} />
);

const Invoice = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="file-document-outline" size={size} color={color} style={style} />
);

const PaymentCard = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="credit-card-outline" size={size} color={color} style={style} />
);

const CheckCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialCommunityIcons name="check-decagram" size={size} color={color} style={style} />
);

const ArrowRightCircle = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <MaterialIcons name="arrow-forward" size={size} color={color} style={style} />
);

const Location = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="location-sharp" size={size} color={color} style={style} />
);

const ArrowUpBold = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Entypo name="arrow-bold-up" size={size} color={color} style={style} />
);

const ArrowBack = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Ionicons name="arrow-back" size={size} color={color} style={style} />
);

const Download = ({ size = defaultSize, color = colors.primary, style }: IconProps) => (
    <Feather name="download" size={size} color={color} style={style} />
);

// Exporting all as object for named JSX usage
export const AppIcons = {
    Home,
    User,
    Delete,
    Back,
    Add,
    Person,
    CheckMark,
    ArrowUp,
    Search,
    Close,
    Check,
    ChevronDown,
    Phone,
    Filter,
    UserCircle,
    Calendar,
    Bookmark,
    Star,
    Cart,
    HeartOutline,
    Bell,
    BookmarkFilled,
    BookmarkOutline,
    Reload,
    Location,
    ArrowUpBold,
    ArrowBack,
    Download,
    Invoice,
    PaymentCard,
    CheckCircle,
    ArrowRightCircle,
};

