import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { CommonServicesService } from '../services/common-services.service';
import { SOAPCallService } from '../services/soapcall.service';
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any, _: any;

@Component({
  selector: 'app-initiatorpage',
  templateUrl: './initiatorpage.component.html',
  styleUrls: ['./initiatorpage.component.css']
})
export class InitiatorpageComponent implements OnInit {
  [x: string]: any;
  documentpanel = false;

  namespace: string = "http://schemas.cordys.com/clotp_metadata";
  taskId: string | undefined;
  submitted = false;
  submitBtnHide = true;
  res_type_selected: string = "show"
  fileUploadDoc: any;
  ResourceTypeDropdown: any = [];
  ResourceDeptDropdown: any = [];
  ResourceDeptNameDropdown: any = [];
  CLOTP_Number: number | undefined;
  userDetailsInput: any = { dn: "" }
  userDetails = {
    userName: '',
    displayName: ''
  };
  PRMUserData: any = [];
  HODUsersArr: any = [];
  HRUsersArr: any = [];
  CPHUsersArr: any = [];
  FDPDUsersArr: any = [];
  remarks: string | undefined;

  filteredOptionsHOD: Observable<string[]> | undefined;
  filteredOptionsHR: Observable<string[]> | undefined;
  filteredOptionsCPH: Observable<string[]> | undefined;
  filteredOptionsFDPD: Observable<string[]> | undefined;

  docData: any = {};
  thChecked = false;

  CLOTPDetailsObj: any = [];
  CLOTPDocArr: any = [];
  CLOTPAAHArr: any =[];

  TaskDetails: any;
  approvalStage: number | undefined;
  approvalRole: string | undefined;

  private filterHOD(value: any): string[] {

    const filterValue = value.toLowerCase();

    return this.HODUsersArr.filter((option: string) => option.toLowerCase().includes(filterValue));
  }
  private filterHR(value: any): string[] {

    const filterValue = value.toLowerCase();

    return this.HRUsersArr.filter((option: string) => option.toLowerCase().includes(filterValue));
  }
  private filterCPH(value: any): string[] {

    const filterValue = value.toLowerCase();

    return this.CPHUsersArr.filter((option: string) => option.toLowerCase().includes(filterValue));
  }
  private filterFDPD(value: any): string[] {

    const filterValue = value.toLowerCase();

    return this.FDPDUsersArr.filter((option: string) => option.toLowerCase().includes(filterValue));
  }



  constructor(private fb: FormBuilder, private service: SOAPCallService, private convtojson: CommonServicesService, private toast: ToastrService, private dtpipe: DatePipe,
    private activatedRoute: ActivatedRoute, private router: Router) {

    this.docData.filesArray = [];
    this.getLovDetails();
    this.loadCLOTPPage();
    this.getloginUserDetails();

  }
  deleteBtnDisable = false;

  ngOnChanges(changes: SimpleChanges): void {

    
  }
  ngOnInit(): void {
    
   
  }

  ngAfterViewInit() {
    this.filteredOptionsHOD = this.requestdetailform.get('HODControl')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterHOD(value || '')),
    );
    this.filteredOptionsHR = this.requestdetailform.get('HRControl')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterHR(value || '')),
    );
    this.filteredOptionsCPH = this.requestdetailform.get('CPHControl')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCPH(value || '')),
    );
    this.filteredOptionsFDPD = this.requestdetailform.get('FDPDControl')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterFDPD(value || '')),
    );
  }

  loadCLOTPPage() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.taskId = params.taskId;
      this.CLOTP_Number = params.CLOTP_NO;
      if (this.datavalidate(this.taskId) != "") {
        $.cordys.json.defaults.removeNamespacePrefix = true;

        var param = {
          TaskId: this.datavalidate(this.taskId),
          Target: '',
          RetrievePossibleActions: 'false',
          ReturnTaskData: 'true'
        }

        this.service.ajax("GetTask", "http://schemas.cordys.com/notification/workflow/1.0", param)
          .then((resp) => {
            this.TaskDetails = $.cordys.json.findObjects(resp, 'Task');
            this.TaskDetails.applicationData = $.cordys.json.findObjects(this.TaskDetails, 'ApplicationData');

            this.CLOTP_Number = this.TaskDetails.applicationData[0].CLOTP_IP_SCHEMAFRAGMENT.CLOTP_NO;
            this.approvalStage = this.TaskDetails.applicationData[0].CLOTP_IP_SCHEMAFRAGMENT.APPROVAL_STAGE;
            this.approvalRole = this.TaskDetails.applicationData[0].CLOTP_IP_SCHEMAFRAGMENT.APPROVER_ROLE;

            if(this.approvalRole == 'HOD'||this.approvalRole == 'CPH'||this.approvalRole == 'HR'||this.approvalRole == 'FDPD'||this.approvalRole == 'FINANCE'){
              this.submitBtnHide = false;
              this.requestdetailform.disable()
            }
           this.getDetails();
          })
        }
          this.getDetails();
    })
  }

  getDetails(){
    let param1 = {
      'CLOTP_NO': this.CLOTP_Number,
    };
    this.service.ajax("GetClotpDetailsObject", this.namespace, param1).
      then((CLOTPDetailsResponse: any) => {
        if (CLOTPDetailsResponse.hasOwnProperty('tuple')) {
          this.CLOTPDetailsObj = this.convtojson.convertTupleToJson(CLOTPDetailsResponse.tuple, 'CLOTP_DETAILS');
          this.requestdetailform.patchValue({
            requestnumber: this.CLOTPDetailsObj[0].REQUEST_NUMBER,
            noofresources: this.CLOTPDetailsObj[0].NOOFRESOURCES,
            resourcetype: this.CLOTPDetailsObj[0].RESOURCETYPE,
            project: this.CLOTPDetailsObj[0].PROJECT,
            resourcedepartment: this.CLOTPDetailsObj[0].RESOURCEDEPARTMENT,
            periodfrom: this.CLOTPDetailsObj[0].PERIODFROM,
            periodto: this.CLOTPDetailsObj[0].PERIODTO,
            justifiaction: this.CLOTPDetailsObj[0].JUSTIFICATION,
            HODControl: this.CLOTPDetailsObj[0].DEPARTMENTHOD,
            HRControl: this.CLOTPDetailsObj[0].HR,
            CPHControl: this.CLOTPDetailsObj[0].CPH,
            FDPDControl: this.CLOTPDetailsObj[0].FDPDHEAD,
          })
          this.res_typeChange(this.CLOTPDetailsObj[0].RESOURCETYPE);
        }
      })

    let param2 = {
      'CLOTP_NO': this.CLOTP_Number,
    };
    this.service.ajax("GetCLOTPDocDetails", this.namespace, param2).
      then((CLOTPDocResponse: any) => {
        if (CLOTPDocResponse.hasOwnProperty('tuple')) {
          this.CLOTPDocArr = this.convtojson.convertTupleToJson(CLOTPDocResponse.tuple, 'CLOTP_DOCUMENTS');
          this.docData.filesArray = [...this.CLOTPDocArr]
        }
      })
      let param3 = {
        'APP_REFNO': this.CLOTP_Number,
      };
      this.service.ajax("GetCLOTPAAHDetails", this.namespace, param3).
        then((CLOTPAAHResponse: any) => {
          if (CLOTPAAHResponse.hasOwnProperty('tuple')) {
            this.CLOTPAAHArr = this.convtojson.convertTupleToJson(CLOTPAAHResponse.tuple, 'CLOTP_AUTO_APPROVAL_HISTORY');
          }
        })

  }

  completeTask(status: any){
      let textMSG= status == '0' ? "Task Rejected Successfully" : status == '1' ? "Task Approved Successfully" : "Task Resubmitted Successfully";

      let params={
        TASKID: this.taskId,
        APPROVAL_DECISION:status,
        APPROVAL_REMARKS :this.datavalidate(this.remarks),
      }
      this.service.ajax("CompleteCLOTPTask", this.namespace, params)
      .then((res: any) => {
        if (res.hasOwnProperty('tuple')) { 
            this.toast.success(textMSG)
            setTimeout(()=>{                   
              this.router.navigate(['/inbox'])
            }, 500);
        }
        })
  }
  rejectTask(status: any){
    if(this.datavalidate(this.remarks) =="" ){
      status == '0' ? this.toast.error("Remarks mandatory for reject!") : this.remarks
    }else{
      this.completeTask(status);
    }
  }

  getloginUserDetails(): void {
    let userDetails = this.service.ajax("GetUserDetails", 'http://schemas.cordys.com/1.0/ldap', this.userDetailsInput).then((ajaxResponse: any) => {
      if (ajaxResponse.hasOwnProperty('tuple')) {
        let data = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'GetUserDetailsResponse');
        this.userDetails.userName = ajaxResponse.tuple.old.user.authuserdn.substring(3, ajaxResponse.tuple.old.user.authuserdn.indexOf(","))
        this.userDetails.displayName = ajaxResponse.tuple.old.user.description;
      }
      localStorage.setItem('userAuthData', JSON.stringify(this.userDetails));
      this.getPRMUserDetails();
    }, (err) => {

    });
  }

  getPRMUserDetails() {
    var params = {
      'UM_TOKEN_NO': this.userDetails.userName,
    };
    var resp = this.service.ajax("GetPRMDetails", this.namespace, params).
      then((ajaxResponse: any) => {
        if (ajaxResponse.hasOwnProperty('tuple')) {
          this.PRMUserData = this.convtojson.convertTupleToJson(ajaxResponse.tuple, 'PRM_USER_MASTER');
          localStorage.setItem('UM_FULLNAME', JSON.stringify(this.PRMUserData[0].UM_FULLNAME));
        }
        this.projectTeamRolesList();
        this.requestdetailform.patchValue({
          tokenname: this.userDetails.userName + " - " + this.PRMUserData[0].UM_FULLNAME,
          requestordepartment: this.PRMUserData[0].DEPARTMENT_NAME,
        });
      }, (err) => {

      });
  }


  getLovDetails() {
    let param = {}

    var resp1 = this.service.ajax("GetLovDetails", this.namespace, param)
      .then((res: any) => {
        if (res.hasOwnProperty('tuple')) {
          let arrLovList = this.convtojson.convertTupleToJson(res.tuple, 'CLOTP_LOV_MASTER_AUTO')
          arrLovList.filter((ele: any) => {
            if (ele.CLOTP_TYPE == "RESOURCE_TYPE") {
              this.ResourceTypeDropdown.push(ele.CLOTP_DESC)
            }
            else if (ele.CLOTP_TYPE == "PROJECT_TYPE") {
              this.ResourceDeptNameDropdown.push(ele.CLOTP_DESC)
            }
            else if (ele.CLOTP_TYPE == "RES_DEPT_NAME") {
              this.ResourceDeptDropdown.push(ele.CLOTP_DESC)
            }
          })
          this.convtojson.resTypeArr(this.ResourceTypeDropdown);
          this.convtojson.resDeptArr(this.ResourceDeptDropdown);
        }
      },
        (err) => {

        })
  }

  // selectRolesform =new FormGroup({
  //   HODControl: new FormControl(""),
  // })


  requestdetailform: any = new FormGroup({
    tokenname: new FormControl({ value: "", disabled: true }),
    requestordepartment: new FormControl({ value: "", disabled: true }),
    resourcetype: new FormControl('', [Validators.required]),
    requestnumber: new FormControl({ value: "", disabled: true }),
    project: new FormControl('', [Validators.required]),
    noofresources: new FormControl('', [Validators.required]),
    resourcedepartment: new FormControl('', [Validators.required]),
    periodfrom: new FormControl('', [Validators.required]),
    periodto: new FormControl('', [Validators.required]),
    justifiaction: new FormControl("", [Validators.required]),
    HODControl: new FormControl("", [Validators.required]),
    HRControl: new FormControl("", [Validators.required]),
    CPHControl: new FormControl("", [Validators.required]),
    FDPDControl: new FormControl("", [Validators.required]),
  })

  get resourcetype() {
    return this.requestdetailform.get('resourcetype');
  }
  get project() {
    return this.requestdetailform.get('project');
  }
  get noofresources() {
    return this.requestdetailform.get('noofresources');
  }
  get resourcedepartment() {
    return this.requestdetailform.get('resourcedepartment');
  }
  get periodfrom() {
    return this.requestdetailform.get('periodfrom');
  }
  get periodto() {
    return this.requestdetailform.get('periodto');
  }
  get justifiaction() {
    return this.requestdetailform.get('justifiaction');
  }
  get HODControl() {
    return this.requestdetailform.get('HODControl');
  }
  get HRControl() {
    return this.requestdetailform.get('HRControl');
  }
  get CPHControl() {
    return this.requestdetailform.get('CPHControl');
  }
  get FDPDControl() {
    return this.requestdetailform.get('FDPDControl');
  }

  save() {
    this.submitted = true;
    let dataObj = {};

    if (this.requestdetailform.valid) {
      if (this.CLOTP_Number != 0 && this.CLOTP_Number != undefined) {
        dataObj = {
          tuple: {
            old: {
              CLOTP_DETAILS: {
                CLOTP_NO: this.CLOTP_Number
              }
            },
            new: {
              CLOTP_DETAILS: {
                CLOTP_NO: this.CLOTP_Number,
                "REQUEST_NUMBER": (this.requestdetailform.controls['requestnumber'].value ? this.requestdetailform.controls['requestnumber'].value : ""),
                'TOKEN_NUMBER': (this.requestdetailform.controls['tokenname'].value ? this.requestdetailform.controls['tokenname'].value : ""),
                "REQUESTORDEPARTMENT": (this.requestdetailform.controls['requestordepartment'].value ? this.requestdetailform.controls['requestordepartment'].value : ""),
                "RESOURCETYPE": (this.requestdetailform.controls['resourcetype'].value ? this.requestdetailform.controls['resourcetype'].value : ""),
                "PROJECT": (this.requestdetailform.controls['project'].value ? this.requestdetailform.controls['project'].value : ""),
                "NOOFRESOURCES": (this.requestdetailform.controls['noofresources'].value ? this.requestdetailform.controls['noofresources'].value : ""),
                "RESOURCEDEPARTMENT": (this.requestdetailform.controls['resourcedepartment'].value ? this.requestdetailform.controls['resourcedepartment'].value : ""),
                "PERIODFROM": this.dtpipe.transform((this.requestdetailform.controls['periodfrom'].value ? this.requestdetailform.controls['periodfrom'].value : ""),'yyyy-MM-dd'),
                "PERIODTO": this.dtpipe.transform((this.requestdetailform.controls['periodto'].value ? this.requestdetailform.controls['periodto'].value : ""),'yyyy-MM-dd'),
                "JUSTIFICATION": (this.requestdetailform.controls['justifiaction'].value ? this.requestdetailform.controls['justifiaction'].value : ""),
                "DEPARTMENTHOD": (this.requestdetailform.controls['HODControl'].value ? this.requestdetailform.controls['HODControl'].value : ""),
                "HR": (this.requestdetailform.controls['HRControl'].value ? this.requestdetailform.controls['HRControl'].value : ""),
                "CPH": (this.requestdetailform.controls['CPHControl'].value ? this.requestdetailform.controls['CPHControl'].value : ""),
                "FDPDHEAD": (this.requestdetailform.controls['FDPDControl'].value ? this.requestdetailform.controls['FDPDControl'].value : ""),
              }
            }
          }
        }
      }
      else {
        dataObj = {
          tuple: {
            new: {
              CLOTP_DETAILS: {
                CLOTP_NO: this.CLOTP_Number,
                // "REQUEST_NUMBER": (this.requestdetailform.controls['FDPDControl'].value ? this.requestdetailform.controls['FDPDControl'].value  : ""),
                'TOKEN_NUMBER': (this.requestdetailform.controls['tokenname'].value ? this.requestdetailform.controls['tokenname'].value : ""),
                "REQUESTORDEPARTMENT": (this.requestdetailform.controls['requestordepartment'].value ? this.requestdetailform.controls['requestordepartment'].value : ""),
                "RESOURCETYPE": (this.requestdetailform.controls['resourcetype'].value ? this.requestdetailform.controls['resourcetype'].value : ""),
                "PROJECT": (this.requestdetailform.controls['project'].value ? this.requestdetailform.controls['project'].value : ""),
                "NOOFRESOURCES": (this.requestdetailform.controls['noofresources'].value ? this.requestdetailform.controls['noofresources'].value : ""),
                "RESOURCEDEPARTMENT": (this.requestdetailform.controls['resourcedepartment'].value ? this.requestdetailform.controls['resourcedepartment'].value : ""),
                "PERIODFROM": this.dtpipe.transform((this.requestdetailform.controls['periodfrom'].value ? this.requestdetailform.controls['periodfrom'].value : ""),'yyyy-MM-dd'),
                "PERIODTO": this.dtpipe.transform((this.requestdetailform.controls['periodto'].value ? this.requestdetailform.controls['periodto'].value : ""),'yyyy-MM-dd'),
                "JUSTIFICATION": (this.requestdetailform.controls['justifiaction'].value ? this.requestdetailform.controls['justifiaction'].value : ""),
                "DEPARTMENTHOD": (this.requestdetailform.controls['HODControl'].value ? this.requestdetailform.controls['HODControl'].value : ""),
                "HR": (this.requestdetailform.controls['HRControl'].value ? this.requestdetailform.controls['HRControl'].value : ""),
                "CPH": (this.requestdetailform.controls['CPHControl'].value ? this.requestdetailform.controls['CPHControl'].value : ""),
                "FDPDHEAD": (this.requestdetailform.controls['FDPDControl'].value ? this.requestdetailform.controls['FDPDControl'].value : ""),
              }
            }
          }
        }
      }

      var resp1 = this.service.ajax("UpdateClotpDetails", this.namespace, dataObj)
        .then((res: any) => {
          if (res.hasOwnProperty('tuple')) {
            if (this.CLOTP_Number !== 0 && this.CLOTP_Number !== undefined) {
              this.toast.success('Data Updated Successfull');
            }
            else {
              this.toast.success('Data Saved Successfull', res.tuple.new.CLOTP_DETAILS.REQUEST_NUMBER);
              // this.requestdetailform.patchValue({ requestnumber: res.tuple.new.CLOTP_DETAILS.REQUEST_NUMBER })
            }
            this.CLOTP_Number = res.tuple.new.CLOTP_DETAILS.CLOTP_NO
            this.saveDocuments();
          }
        },
          (err) => {

          })
    }
  }

  submit() {
    if (this.CLOTP_Number != 0 && this.CLOTP_Number != undefined) {
      let param = {
        'CLOTP_NO': this.CLOTP_Number
      };

      var response = this.service.ajax("CLOTP_BPM", "http://schemas.cordys.com/default", param).
        then((ajaxResponse: any) => {
          if (ajaxResponse.data.instance_id != "") {
            this.toast.success('Data Submitted Successfully')
            this.router.navigate(['/inbox'])
          }
        })
    }
  }


  projectTeamRolesList() {
    let param = {};

    var resp1 = this.service.ajax("GetProjectTeamDetails", this.namespace, param)
      .then((res: any) => {
        if (res.hasOwnProperty('tuple')) {
          let arrProjectTeamList = this.convtojson.convertTupleToJson(res.tuple, 'PROJECT_TEAM')
          arrProjectTeamList.filter((v: any) => {
            v.UM_USER_ID = v.UM_USER_ID + " - " + this.PRMUserData[0].UM_FULLNAME;
          })
          arrProjectTeamList.filter((ele: any) => {
            if (ele.UM_USER_ROLE == "HOD") {
              this.HODUsersArr.push(ele.UM_USER_ID)
            }
            else if (ele.UM_USER_ROLE == "HR") {
              this.HRUsersArr.push(ele.UM_USER_ID)
            }
            else if (ele.UM_USER_ROLE == "CPH") {
              this.CPHUsersArr.push(ele.UM_USER_ID)
            }
            else if (ele.UM_USER_ROLE == "FDPD") {
              this.FDPDUsersArr.push(ele.UM_USER_ID)
            }
          })
        }
      })
  }

  res_typeChange(e: any) {
    if (e.includes("Resource week OTP")){
      this.res_type_selected = "Resource week OTP"
      this.CPHControl.setValidators(null);
      this.FDPDControl.setValidators(null);
    }
    else if (e.includes("Project OTP")) {
      this.res_type_selected = "Project OTP"
      this.CPHControl.setValidators(null);
    }
    else if (e.includes("Casual Labour-Dept")) {
      this.res_type_selected = "Casual Labour-Dept"
      this.HRControl.setValidators(null);
      this.CPHControl.setValidators(null);
    }
    else if (e.includes("Casual Labour-Project")) {
      this.res_type_selected = "Casual Labour-Project"
      this.HRControl.setValidators(null);
    }
  }

  uploadFile() {
    $("#fileUploadDoc").click();
  }

  file: any;
  fileName: any;

  UploadFileDoc(e: any) {

    this.file = e.target.files
    this.fileName = this.file[0].name;

    if (this.file == "" || this.file == null || this.file == undefined) {
      this.toast.warning("Please Select Any File");
      return false;
    }
    else if (this.fileName.lastIndexOf(".") == -1) {
      this.toast.info("File Format Not Recognized. Please Select Different File");
      return false;
    }
    else if (this.fileName.indexOf("@") > -1 || this.fileName.indexOf("#") > -1) {
      this.toast.warning("File must not contain \"@\" or \"#\". Please Remove And Try Again");
      return false;
    }
    else if (this.file !== "" || this.file !== null || this.file !== undefined) {
      if (this.docData.filesArray.length == 0) {
        this.saveFileInServer();
      }
      else {
        const record = this.docData.filesArray.find((item: any) => {
          return item.DOC_NAME == this.fileName
        })
        if (record) {
          this.toast.error("This file already exists")
        }
        else {
          this.saveFileInServer();
        }
      }
    }
  }


  async saveFileInServer() {
    var ext = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
    var fileRead = this.file[0];
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var fileContent = e.target.result;
      var param = {
        'FileName': this.fileName,
        'FileContent': fileContent,
        'FolderName': ""
      }
      this.service.ajax("UploadCLOTPDocument", this.namespace, param)
        .then((res: any) => {
          if (res.hasOwnProperty('tuple')) {
            var fileTypeObj = $('#document');
            var DOC_PATH = res.tuple.old.uploadCLOTPDocument.uploadCLOTPDocument;
            fileTypeObj.replaceWith(fileTypeObj = fileTypeObj.clone(true));

            this.docData.filesArray.push({

              'DOC_NAME': this.datavalidate(this.fileName),
              'DOC_PATH': this.datavalidate(DOC_PATH),
              "STAGE": "",
              'UPLOADED_BY': this.datavalidate(this.userDetails.userName),
              'UPLOADED_ON': formatDate(new Date, 'dd-MM-yyyy', 'en-US'),
              'CLOTP_NO': this.CLOTP_Number

            })
          }
        })
    }
    await reader.readAsDataURL(fileRead)
  }

  saveDocuments() {
    let ParamTuple: {}[] = [];
    var params = {};
    for (var i = 0; i < this.docData.filesArray.length; i++) {
      if (this.docData.filesArray[i].DOC_ID == undefined || this.docData.filesArray[i].DOC_ID == "" || this.docData.filesArray[i].DOC_ID == null) {
        params = {
          'new': {
            'CLOTP_DOCUMENTS': {
              'DOC_ID': "",
              'DOC_NAME': this.datavalidate(this.docData.filesArray[i].DOC_NAME),
              'DOC_PATH': this.datavalidate(this.docData.filesArray[i].DOC_PATH),
              "STAGE": "",
              'UPLOADED_BY': this.datavalidate(this.docData.filesArray[i].UPLOADED_BY),
              'UPLOADED_ON': this.datavalidate(this.docData.filesArray[i].UPLOADED_ON),
              'CLOTP_NO': this.CLOTP_Number
            }
          }
        };
      }
      else {
        params = {
          'old': {
            'CLOTP_DOCUMENTS': {
              'DOC_ID': this.docData.filesArray[i].DOC_ID
            }
          },
          'new': {
            'CLOTP_DOCUMENTS': {
              'DOC_ID': this.docData.filesArray[i].DOC_ID,
              'DOC_NAME': this.datavalidate(this.docData.filesArray[i].DOC_NAME),
              'DOC_PATH': this.datavalidate(this.docData.filesArray[i].DOC_PATH),
              "STAGE": "",
              'UPLOADED_BY': this.datavalidate(this.docData.filesArray[i].UPLOADED_BY),
              'UPLOADED_ON': this.datavalidate(this.docData.filesArray[i].UPLOADED_ON),
              'CLOTP_NO': this.CLOTP_Number
            }
          }
        }
      }
      ParamTuple.push(params);
    }
    var paramsAll = { 'tuple': ParamTuple };
    this.service.ajax("UpdateClotpDocuments", this.namespace, paramsAll)
      .then((res: any) => {
        if (res.hasOwnProperty('tuple')) {
          this.toast.success("Upload successfully");
        }
      },
        (err: any) => {
          console.log("Error occured while saving data ")
        })
  }

  checkedRows: any = []

  tdCheckbox() {
    this.checkedRows = []

    this.docData.filesArray.forEach((row: any) => {
      if (row.isChecked == true) {
        this.checkedRows.push(row)
      }
    })
    if (this.checkedRows.length > 0) {
      this.thChecked = true;
    }
  }

  deleteFile() {
    if (this.checkedRows.length == 0) {
      this.toast.warning("At least one should ne selected!")
    } else {
      this.docData.filesArray.forEach((row: any, index: any) => {
        if (row.isChecked) {
          let dataObj = {
            tuple: {
              old: {
                CLOTP_DOCUMENTS: {
                  DOC_ID: row.DOC_ID,
                }
              }
            }
          }
          this.service.ajax("UpdateClotpDocuments", this.namespace, dataObj).
            then((ajaxResponse: any) => {
              if (ajaxResponse.hasOwnProperty('tuple')) {
                this.toast.success("File deleted succesfully")
                this.docData.filesArray.splice(index, this.checkedRows.length)
              }
              if (this.docData.filesArray.length == 0) {
                this.thChecked = false;
              }
            })
        }
      })

    }

  }

  // Document table checkbox code


  checkAllCheckBox(event: any) {

    this.docData.filesArray.forEach((element1: any) => {
      element1.isChecked = event.target.checked
    });
    this.tdCheckbox();
  }
  isAllCheckBoxChecked() {
    return this.docData.filesArray.every((p: any) => p.isChecked);
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


