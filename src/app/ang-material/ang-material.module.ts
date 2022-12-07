import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatSortModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  exports: [
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatSortModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule
  ]
})
export class AngMaterialModule {}
