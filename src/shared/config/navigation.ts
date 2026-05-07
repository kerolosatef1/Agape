import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Settings,
  User2,
  Calendar,
  BookOpen,
  Baby,
  ClipboardCheck,
  Wallet, 
  WalletMinimal,
  PartyPopper,
  Receipt,
  CreditCard ,
  Award, Package

} from "lucide-react";

export type NavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  labelKey?: string;
  label?: string;
  adminOnly?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    labelKey: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "seasons",
    labelKey: "nav.seasons",
    href: "/seasons",
    icon: Calendar,
    adminOnly: true,
  },/*
  {
    key: "members",
    labelKey: "nav.members",
    href: "/members",
    icon: UserCheck,
  },*/  {
    key: "receive",
    labelKey: "nav.receive",
    href: "/receive",
    icon: Receipt,
    adminOnly: true,
  },
  {
    key: "attendance",
    labelKey: "nav.attendance",
    href: "/attendance",
    icon: ClipboardCheck,
  },
  { key: "users", labelKey: "nav.users", href: "/users", icon: Users },
   {
    key: "classes",
    labelKey: "nav.classes",
    href: "/classes",
    icon: BookOpen,
  },
   { key: "spend", labelKey: "nav.spend", href: "/spend", icon: CreditCard, adminOnly: true },
  {
    key: "children",
    labelKey: "nav.children",
    href: "/children",
    icon: Baby,
  },
  { key: "point-score", labelKey: "nav.pointScore", href: "/point-score", icon: Award, adminOnly: true },
  { key: "stock", labelKey: "nav.stock", href: "/stock", icon: Package, adminOnly: true },
  
  {
    key: "budget-withdraw",
    labelKey: "nav.budgetWithdraw",
    href: "/budget-withdraw",
    icon: WalletMinimal,
    adminOnly: true,
  },
  {
    key: "budget",
    labelKey: "nav.budget",
    href: "/budget",
    icon: Wallet,
    adminOnly: true,
  },
  {
    key: "festivals",
    labelKey: "nav.festivals",
    href: "/festivals",
    icon: PartyPopper,
    adminOnly: true,
  },/*
  {
    key: "roles",
    labelKey: "nav.rolesPermissions",
    href: "/roles-permissions",
    icon: Shield,
  },*/
  { key: "profile", labelKey: "nav.profile", href: "/profile", icon: User2 },/*
  {
    key: "settings",
    labelKey: "nav.settings",
    href: "/settings",
    icon: Settings,
  },*/
];