import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngMaterialModule } from './ang-material/ang-material.module';
import { InitiatorComponent } from './initiator/initiator.component';
import { myRoutings } from './app-routing.module';
import { InitiatorpageComponent } from './initiatorpage/initiatorpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InboxComponent } from './inbox/inbox.component';
import { SearchComponent } from './search/search.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    myRoutings,
    InitiatorpageComponent,
    InboxComponent,
    SearchComponent,
    NotFoundComponent,
    InitiatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      messageClass: 'toast-message',
      timeOut: 4000 ,
      closeButton: true,

    }),
    BsDatepickerModule.forRoot()
    
  ],
  exports:[
    MatNativeDateModule,
  ],
  providers: [DatePipe,MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
