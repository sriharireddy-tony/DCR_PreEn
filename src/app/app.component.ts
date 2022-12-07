import { Component, OnInit } from '@angular/core';
import { environment, SOAPCallService } from './services/soapcall.service';
import { AppObjects} from './appObjects'
import { CommonServicesService } from './services/common-services.service';

declare var $: any, _: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'clotp';

  userDetailsInput: any = { dn: "" }
  userDetails = {
    userName: '',
    displayName: ''
  };

  constructor( private appobject: AppObjects, private service: SOAPCallService, private convtojson: CommonServicesService){}
  
ngOnInit(): void{

  this.login();
  // this.getDetails();
}


login(){
  if($.cordys.authentication.sso.isAuthenticated()){    
}
else{
  $.cordys.authentication.sso.authenticate("srihari","srihari").done( function () {
});
}  
}

// getDetails(){
//   this.service.ajax("GetUserDetails", 'http://schemas.cordys.com/1.0/ldap', this.userDetailsInput).then((ajaxResponse: any) => {
//     if (ajaxResponse.hasOwnProperty('tuple')) {
//       let data = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'GetUserDetailsResponse');
//       this.userDetails.userName = ajaxResponse.tuple.old.user.authuserdn.substring(3, ajaxResponse.tuple.old.user.authuserdn.indexOf(","))
//       this.userDetails.displayName = ajaxResponse.tuple.old.user.description;
//       this.appobject.LoggedInUser = ({'userName': this.userDetails.userName, 'displayName': this.userDetails.displayName})
//     }
//     localStorage.setItem('userAuthData', JSON.stringify(this.userDetails));
//   }, (err) => {

//   });
// }

}