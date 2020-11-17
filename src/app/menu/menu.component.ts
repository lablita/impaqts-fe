import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuEmitterService } from './menu-emitter.service';
import { MenuService } from './menu.service';

export class MenuEvent {
  constructor(
    public item: string,
  ) { }
}


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  public items: MenuItem[] = [];

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.items = this.menuService.getMenuItems();
  }

}
