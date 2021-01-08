import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';


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
    CheckboxModule,
    InputTextareaModule,
    FileUploadModule,
    SidebarModule,
    MessagesModule,
    MessageModule,
    SliderModule,
    TableModule,
    MultiSelectModule,
    ToastModule,
    ScrollPanelModule,
    TreeModule,
    ListboxModule,
    ProgressSpinnerModule,
    DialogModule
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
    CheckboxModule,
    InputTextareaModule,
    FileUploadModule,
    SidebarModule,
    MessagesModule,
    MessageModule,
    SliderModule,
    TableModule,
    MultiSelectModule,
    ToastModule,
    ScrollPanelModule,
    TreeModule,
    ListboxModule,
    ProgressSpinnerModule,
    DialogModule
  ]
})
export class PrimeNgModule { }
