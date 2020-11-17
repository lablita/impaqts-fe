import { MenuItem } from 'primeng/api';

export class MenuItemObject implements MenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  items?: MenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  routerLink?: any;

  constructor(label?: string, icon?: string, command?: any, url?: string, items?: MenuItem[], expanded?: boolean, disabled?: boolean, routerLink?: any) {
    this.label = label;
    this.icon = icon;
    this.command = command;
    this.url = url;
    this.items = items;
    this.expanded = expanded;
    this.disabled = disabled;
    this.routerLink = routerLink;
  }
}
