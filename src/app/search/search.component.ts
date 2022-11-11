import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonServicesService } from '../services/common-services.service';
import { SOAPCallService } from '../services/soapcall.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  namespace: string = "http://schemas.cordys.com/clotp_metadata";


search: any=[];

  requestNumber: string | undefined;
  requestName: string | undefined;
  resourceType: string | undefined;
  resourceDepartment: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  status: string | undefined;

  searchData: any =[];
 show = false;
  totalLength: number= 0;
  page = 1;

  constructor( private service: SOAPCallService, private convtojson: CommonServicesService, private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
  
  }


  handlePageChange(event: number) {
    this.page = event;
  }

  clear(){
    this.search =[];
  }

  searchAll() {
    this.searchData =[];
    this.totalLength= 0;
let param = {

  'RequestNumber': this.datavalidate(this.search.requestNumber),
  'TokenName':  this.datavalidate(this.search.requestName),
  'ResourceType': this.datavalidate(this.search.resourceType),
  'ResourceDepartment': this.datavalidate(this.search.resourceDepartment),
  'FromDate': this.datavalidate(this.search.fromDate),
  'ToDate': this.datavalidate(this.search.toDate),
  'Stage': this.datavalidate(this.search.status)
}

var resp = this.service.ajax("SearchCLOTPDetails", this.namespace, param).
      then((ajaxResponse: any) => {
        
        if (ajaxResponse.hasOwnProperty('tuple')) {
          this.searchData = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'CLOTP_DETAILS');
          this.totalLength=  this.searchData.length;
        }
        this.show =  this.totalLength==0 ? true : false;

      })
  }

  showSearchCLOTP(requestNumber: string){
    let param = {
      'REQUEST_NUMBER': this.datavalidate(requestNumber),
    }
   this.service.ajax("GetCLOTPNoByreqNODetails", this.namespace, param)
          .then((ajaxResponse: any) => {
            if (ajaxResponse.hasOwnProperty('tuple')) {
              let CLOTP_NO =ajaxResponse.tuple.old.CLOTP_DETAILS.CLOTP_NO
              this.router.navigate(['/home'],{ queryParams: { CLOTP_NO: CLOTP_NO } });
            }
          })
  }

  click(){
    alert("calling")
  }

  datavalidate(data: string | null | undefined) {
    //debugger;
    if (data != undefined && data != null && data != "") {
      return data;
    } else {
      return "";
    }
  }
}
