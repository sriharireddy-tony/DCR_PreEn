import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonServicesService } from '../services/common-services.service';
import { SOAPCallService } from '../services/soapcall.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

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
  resourceType: string ="";
  resourceDepartment: string ="";
  fromDate: string | undefined;
  toDate: string | undefined;
  status ='';

  searchData: any = [];
  show = false;
  totalLength: number = 0;
  page = 1;
  
  resTypeArr: any =[]
  resDeptArr: any =[]
  statusArray=['In Progress','Completed'];

  constructor(private service: SOAPCallService, private convtojson: CommonServicesService, private toast: ToastrService, private router: Router,private dtpipe: DatePipe) {
    
   }
   ngOnChanges(changes: SimpleChanges): void {
    
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
    if(new Date(this.datavalidate(this.search.toDate)) < new Date(this.datavalidate(this.search.fromDate))){
      return Swal.fire('ToDate not greater than FromDate', "", 'warning');
    }
    let status =this.datavalidate(this.search.status) == "In Progress" ? 2 : this.datavalidate(this.search.status) == "Completed" ? 1 : null
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
        status == null ? this.flag = false : this.param = { 'Stage': status }
        break;
        case 'Saved':
        this.param = { 'Stage': 0 }
          break;
      case 'selectAll':
        this.param = {
          'RequestNumber': this.datavalidate(this.search.requestNumber),
          'TokenName': this.datavalidate(this.search.requestName),
          'ResourceType': this.datavalidate(this.search.resourceType),
          'ResourceDepartment': this.datavalidate(this.search.resourceDepartment),
          'FromDate': this.dtpipe.transform(this.datavalidate(this.search.fromDate), 'dd-MM-yy'),
          'ToDate': this.dtpipe.transform(this.datavalidate(this.search.toDate), 'dd-MM-yy'),
          'Stage': status
        }
        break;
      default:
        break;
    }
    this.flag ?
      this.service.ajax("SearchCLOTPDetails", this.namespace, this.param)
        .then((ajaxResponse: any) => {
          if (ajaxResponse.hasOwnProperty('tuple')) {
            this.searchData = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'PRM_USER_MASTER');
            this.totalLength = this.searchData.length;
          }
          this.show = this.totalLength == 0 ? true : false;
        })
      : Swal.fire('Please fill the data at least one field!', "", 'warning');
  }

  showSearchCLOTP(item: any) {
    let param = {
      'REQUEST_NUMBER': this.datavalidate(item.REQUEST_NUMBER),
    }
    this.service.ajax("GetCLOTPNoByreqNODetails", this.namespace, param)
      .then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          let CLOTP_NO = ajaxResponse.tuple.old.CLOTP_DETAILS.CLOTP_NO
          let STATUS = ajaxResponse.tuple.old.CLOTP_DETAILS.STATUS
          this.router.navigate(['/home'], { queryParams: { CLOTP_NO: CLOTP_NO,
             page: STATUS == '0' ? 'savePage' : 'viewPage'} });
        }
      })
  }

  exportToExcel(){
    let param = {
      'requestNumber': this.datavalidate(this.search.requestNumber),
      'requestNumberName': this.datavalidate(this.search.requestName),
      'resourceType': this.datavalidate(this.search.resourceType),
      'resourceDepartment': this.datavalidate(this.search.resourceDepartment),
      'fromDate': this.dtpipe.transform(this.datavalidate(this.search.fromDate), 'dd-MM-yy'),
      'toDate': this.dtpipe.transform(this.datavalidate(this.search.toDate), 'dd-MM-yy'),
      'status': this.datavalidate(this.search.status) == "In Progress" ? 2 : this.datavalidate(this.search.status) == "Completed" ? 1 : 0
    }
    this.service.ajax("GetCLOTPExportExcel", this.namespace, param)
      .then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          let fileContent = ajaxResponse.tuple.old.getCLOTPExportExcel.getCLOTPExportExcel;
          // let fileContent = DownDoc["downloadDocument"];
           let docContent: any = atob(fileContent);
           let contentArray = new Uint8Array(docContent.length);
           for (let lpvar = 0; lpvar < docContent.length; lpvar++) {
             contentArray[lpvar] = docContent.charCodeAt(lpvar);
           }
           let xlBlob = new Blob([contentArray], { type: "application/octet-stream" });
           // saveAs(xlBlob, fileName);
           const a = document.createElement('a')
           const objectUrl = URL.createObjectURL(xlBlob)
           a.href = objectUrl
          a.download = "CLOTPExcel.xls";
           a.click();
           URL.revokeObjectURL(objectUrl);
        }
      })
  }
  summaryReport(){
    let param = {
      'request_Number': this.datavalidate(this.search.requestNumber),
      'requestorTokenName': this.datavalidate(this.search.requestName),
      'resourceType': this.datavalidate(this.search.resourceType),
      'resourceDepartment': this.datavalidate(this.search.resourceDepartment),
      'from_Date': this.dtpipe.transform(this.datavalidate(this.search.fromDate), 'dd-MM-yy'),
      'to_Date': this.dtpipe.transform(this.datavalidate(this.search.toDate), 'dd-MM-yy'),
      'status': this.datavalidate(this.search.status) == "In Progress" ? 2 : this.datavalidate(this.search.status) == "Completed" ? 1 : 0
    }
    this.service.ajax("GenerateClotpDetailsReport", this.namespace, param)
    .then((ajaxResponse: any) => {
      if (ajaxResponse.hasOwnProperty('tuple')) {
        let fileName = ajaxResponse.tuple.old.generateClotpDetailsReport.generateClotpDetailsReport;
        this.downloadReportpdf(fileName);
      }
    })
  }
  downloadReportpdf(fileName: string){
    let param = {
      'fileName': this.datavalidate(fileName),
    }
    this.service.ajax("DownloadCLOTPReport", this.namespace, param)
      .then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          let fileContent = ajaxResponse.tuple.old.downloadCLOTPReport.downloadCLOTPReport;
          // let fileContent = DownDoc["downloadDocument"];
           let docContent: any = atob(fileContent);
           let contentArray = new Uint8Array(docContent.length);
           for (let lpvar = 0; lpvar < docContent.length; lpvar++) {
             contentArray[lpvar] = docContent.charCodeAt(lpvar);
           }
           let xlBlob = new Blob([contentArray], { type: "application/octet-stream" });
           // saveAs(xlBlob, fileName);
           const a = document.createElement('a')
           const objectUrl = URL.createObjectURL(xlBlob)
           a.href = objectUrl
          a.download = fileName;
           a.click();
           URL.revokeObjectURL(objectUrl);
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
