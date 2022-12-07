import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonServicesService } from '../services/common-services.service';
import { SOAPCallService } from '../services/soapcall.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  namespace: string = "http://schemas.cordys.com/clotp_metadata";

  inboxData:any =[];
  searchData: any =[];
  show = false;
  loginUserRoles: string = "";
  loggedInUser: string =""
   totalLength: number= 0;
   page = 1;

  constructor(private service: SOAPCallService, private convtojson: CommonServicesService, private toast: ToastrService, private router: Router) {
    // this.convtojson.userId.subscribe ((val1 : any)  =>{
    //   this.loggedInUser = val1;
    // })
    this.loggedInUser= JSON.parse(localStorage.getItem('userLoginId')!);
   }

  ngOnInit(): void {
    this.getRoles();
  }

  
  handlePageChange(event: number) {
    this.page = event;
  }


loadInboxDetails(){
    this.searchData =[];
    this.totalLength= 0;

let param = {
  'userId': this.loggedInUser,
  "loginUserRoles": this.loginUserRoles
}
      this.service.ajax("GetInboxTaskDetails", "http://schemas.cordys.com/clotp_metadata", param).
       then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          this.inboxData = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'PRM_USER_MASTER');
          this.totalLength=  this.inboxData.length;
        }
        this.show =  this.totalLength==0 ? true : false;
      })
}

getRoles(){
  let Roles: any[] = [];
  let param = {
    'userId': this.loggedInUser,
  }
  this.service.ajax("GetClotpRolesByUserId", "http://schemas.cordys.com/clotp_metadata", param).
       then((res: any) => {
        if (res.hasOwnProperty('tuple')) {
          let roles = this.convtojson.convertTupleToJson(res.tuple, 'PROJECT_TEAM');
          roles.filter((item: any) =>{
            Roles.push(item.UM_USER_ROLE)
            this.loginUserRoles = Roles.toString();
          })
          this.loadInboxDetails();
        }
      })
}

showInboxCLOTP(taskId: any){
  this.router.navigate(['/home'],{ queryParams: { taskId: taskId } }
  );
}
  
}
