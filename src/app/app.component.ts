import { Component, OnInit } from '@angular/core';
import { environment } from './services/soapcall.service';
declare var $: any, _: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'clotp';
  
ngOnInit(): void{

  this.login();
}

login(){
    
  
    $.cordys.authentication.sso.authenticate("srihari","srihari").done( (res: any) => {
  
      if(environment.production == false){
  
          if (document.cookie != "") {
  
          localStorage['token'] = $.cordys.getCookie("defaultinst_SAMLart");
  
          this.deleteAllCookies();

          //this.getloginUserDetails();
         
          // alert("Login Successfull");
          // this.router.navigate(['/home']);
          
      }
    }
  });
  
  }

  deleteAllCookies() {

    var cookies = document.cookie.split(";");
  
    for (var i = 0; i < cookies.length; i++) {
  
        var cookie = cookies[i];
  
        var eqPos = cookie.indexOf("=");
  
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
    }
  
  }

}