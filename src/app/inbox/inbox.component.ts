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
   totalLength: number= 0;
   page = 1;

  constructor(private service: SOAPCallService, private convtojson: CommonServicesService, private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
   this.loadInboxDetails();
  }

  
  handlePageChange(event: number) {
    this.page = event;
  }


loadInboxDetails(){

    this.searchData =[];
    this.totalLength= 0;

let param = {}

      this.service.ajax("GetInboxTaskDetails", "http://schemas.cordys.com/clotp_metadata", param).
       then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          this.inboxData = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'CLOTP_DETAILS');
          this.totalLength=  this.inboxData.length;
        }
        this.show =  this.totalLength==0 ? true : false;

      })
}

showInboxCLOTP(taskId: any){
  this.router.navigate(['/home'],{ queryParams: { taskId: taskId } }
  );
}
  
}
