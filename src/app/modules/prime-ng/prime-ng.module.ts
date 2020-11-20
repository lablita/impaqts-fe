import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioButtonModule } from 'primeng/radiobutton';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    PanelMenuModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule
  ],
  exports: [
    CommonModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    PanelMenuModule,
    InputTextModule,
    RadioButtonModule,
    CheckboxModule
  ]
})
export class PrimeNgModule { }
