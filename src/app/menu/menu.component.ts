import { Component, OnInit } from '@angular/core';
import { CONCORDANCE } from '../model/constants';
import { MenuEmitterService } from './menu-emitter.service';
import { MenuItemObject } from './menu-item-object';
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


  public items: MenuItemObject[] = [];

  constructor(
    private readonly menuEmitterService: MenuEmitterService,
    private readonly menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.items = this.menuService.getMenuItems(CONCORDANCE);
    this.menuEmitterService.click.subscribe((event: MenuEvent) => {
      if (event.item) {
        this.items = this.menuService.getMenuItems(event.item);
      }
    });
  }


}
