import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiatorComponent } from './initiator/initiator.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InboxComponent } from './inbox/inbox.component';
import { SearchComponent } from './search/search.component';
import { InitiatorpageComponent } from './initiatorpage/initiatorpage.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: InitiatorpageComponent},
    {path: 'inbox', component: InboxComponent},
    {path: 'search', component: SearchComponent},
   { path: "**", redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const myRoutings =[
  InitiatorComponent,
  InitiatorpageComponent,
  InboxComponent,
  SearchComponent
]