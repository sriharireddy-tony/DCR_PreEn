import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonServicesService } from '../services/common-services.service';
import { SOAPCallService } from '../services/soapcall.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  namespace: string = "http://schemas.cordys.com/clotp_metadata";


  search: any = [];
  param: any;
  flag: boolean | undefined;

  requestNumber: string | undefined;
  requestName: string | undefined;
  resourceType: string | undefined;
  resourceDepartment: string | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  status: string | undefined;

  searchData: any = [];
  show = false;
  totalLength: number = 0;
  page = 1;

  resTypeArr: any =[]
  resDeptArr: any =[]
  constructor(private service: SOAPCallService, private convtojson: CommonServicesService, private toast: ToastrService, private router: Router,private dtpipe: DatePipe) {
    
   }
   ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
  }

  ngOnInit(): void {
    this.convtojson.var1.subscribe ((val : any)  =>{
      this.resTypeArr = val;
    })
    this.convtojson.var2.subscribe ((val1 : any)  =>{
      this.resDeptArr = val1;
    })
  }

  handlePageChange(event: number) {
    this.page = event;
  }

  clear() {
    this.search = [];
  }

  searchitems(item: any) {
    this.searchData = [];
    this.totalLength = 0;
    this.flag = true;

    switch (item) {
      case 'requestNumber':
        this.datavalidate(this.search.requestNumber) == "" ? this.flag = false : this.param = { 'RequestNumber': this.datavalidate(this.search.requestNumber) }
        break;
      case 'requestName':
        this.datavalidate(this.search.requestName) == "" ? this.flag = false : this.param = { 'TokenName': this.datavalidate(this.search.requestName) }
        break;
      case 'resourceType':
        this.datavalidate(this.search.resourceType) == "" ? this.flag = false : this.param = { 'ResourceType': this.datavalidate(this.search.resourceType) }
        break;
      case 'resourceDepartment':
        this.datavalidate(this.search.resourceDepartment) == "" ? this.flag = false : this.param = { 'ResourceDepartment': this.datavalidate(this.search.resourceDepartment) }
        break;
      case 'fromDate':
        this.datavalidate(this.search.fromDate) == "" ? this.flag = false : this.param = { 'FromDate': this.dtpipe.transform(this.datavalidate(this.search.fromDate), 'dd-MM-yy')}
        break;
      case 'toDate':
        this.datavalidate(this.search.toDate) == "" ? this.flag = false : this.param = { 'ToDate': this.dtpipe.transform(this.datavalidate(this.search.toDate), 'dd-MM-yy') }
        break;
      case 'status':
        this.datavalidate(this.search.status) == "" ? this.flag = false : this.param = { 'Stage': this.datavalidate(this.search.status) }
        break;
      case 'selectAll':
        this.param = {
          'RequestNumber': this.datavalidate(this.search.requestNumber),
          'TokenName': this.datavalidate(this.search.requestName),
          'ResourceType': this.datavalidate(this.search.resourceType),
          'ResourceDepartment': this.datavalidate(this.search.resourceDepartment),
          'FromDate': this.dtpipe.transform(this.datavalidate(this.search.fromDate), 'dd-MM-yy'),
          'ToDate': this.dtpipe.transform(this.datavalidate(this.search.toDate), 'dd-MM-yy'),
          'Stage': this.datavalidate(this.search.status)
        }
        break;
      default:
        break;
    }
    this.flag ?
      this.service.ajax("SearchCLOTPDetails", this.namespace, this.param)
        .then((ajaxResponse: any) => {
          if (ajaxResponse.hasOwnProperty('tuple')) {
            this.searchData = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'CLOTP_DETAILS');
            this.totalLength = this.searchData.length;
          }
          this.show = this.totalLength == 0 ? true : false;
        })
      : this.toast.error("fill data at least one field!")
  }

  showSearchCLOTP(requestNumber: string) {
    let param = {
      'REQUEST_NUMBER': this.datavalidate(requestNumber),
    }
    this.service.ajax("GetCLOTPNoByreqNODetails", this.namespace, param)
      .then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          let CLOTP_NO = ajaxResponse.tuple.old.CLOTP_DETAILS.CLOTP_NO
          this.router.navigate(['/home'], { queryParams: { CLOTP_NO: CLOTP_NO } });
        }
      })
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
