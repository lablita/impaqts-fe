import { MenuItem } from 'primeng/api';

export class MenuItemObject implements MenuItem {
  label?: string;
  icon?: string;
  command: (event?: any) => void;
  url?: string;
  items?: MenuItem[];
  expanded = false;
  disabled = false;
  routerLink: any;

  constructor(
    label: string | null, icon: string | null, command: any, url: string | null,
    items: MenuItem[] | null, expanded: boolean, disabled: boolean, routerLink: any) {
    if (label) {
      this.label = label;
    }
    if (icon) {
      this.icon = icon;
    }
    this.command = command;
    if (url) {
      this.url = url;
    }
    if (items) {
      this.items = items;
    }
    this.expanded = expanded;
    this.disabled = disabled;
    this.routerLink = routerLink;
  }
}
