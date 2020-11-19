import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    PanelMenuModule,
    InputTextModule
  ],
  exports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    PanelMenuModule,
    InputTextModule
  ]
})
export class PrimeNgModule { }
