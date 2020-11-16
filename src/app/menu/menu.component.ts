import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuUtils } from './menu-utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public items: MenuItem[];

  private menuItems: {

  }

  constructor() { }

  ngOnInit(): void {
    this.items = MenuUtils.getMenu('');
  }

}
