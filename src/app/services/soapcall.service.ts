import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService

import { map } from 'rxjs/operators';

declare var $: any, _: any;

export const environment = {

  production: false,

  timeout: 180000,

};

@Injectable({
  providedIn: 'root'
})
export class SOAPCallService {

  ajaxData: any = [];

    globalUser: any = {};

    globalPartsVariable: any = [];

    globalDocsVariable: any = [];

    globalFieldsVariable: any = [];

 

    globalGet(key: string | number) {

      return key ? this.globalUser[key] : this.globalUser;

    }

 

    globalSet(key: string | number, data: any) {

      this.globalUser[key] = data;

    }

    getAjax() {

        return this.ajaxData;

      }

      setAjax(data: any) {

        this.ajaxData.unshift(data);

      }

      delAjax() {

        this.ajaxData = [];

      }

      constructor(private ngxService: NgxUiLoaderService,   private router: Router,) {
       
      }
   

      start() {
        // this.ngxService.start();
        $('body').append("<div class='loader'></div>");

      }

      stop() {
        // this.ngxService.stop();
        $('.loader').last().remove();

      }

    
      ajax(method: any,namespace: any,parameters: any, flag = true){

        let t=this;

        if(environment.production == true){

          return new Promise((rev,rej)=>{

            if (flag == true) t.start();

            $.cordys.ajax({

              method:method,

              timeout:environment.timeout,

              namespace:namespace,

              dataType: "* json",

              parameters: parameters,

              success: function success(resp: unknown) {

                 rev(resp);

                 if (flag == true) t.stop();

              },

              error:function error(e1: any,e2: any,e3: any){

                if (flag == true) t.stop();

                 rej([e1,e2,e3]);

              }

            })

          })

        }else{

          return new Promise((rev,rej)=>{

            if (flag == true) t.start();

            $.cordys.ngajax({

              method:method,

              timeout:environment.timeout,

              namespace:namespace,

              dataType: "* json",

              parameters: parameters,

              success: function success(resp: unknown) {

                if (flag == true) t.stop();

                rev(resp);

             },

            //  error:function error(e1: { responseJSON: { faultstring: { text: string; }; }; },e2: any,e3: any){
            //    if(e1.responseJSON.faultstring.text=='Unable to bind the artifact to a SAML assertion.'){
            //     alert('Session expired. Please re-login.');
            //     t.router.navigate(["/login"]);
            //     return true;
            //    }
            //   if (flag == true) t.stop();

            //     rej([e1,e2,e3]);

            //  }

            })

          })

        }

      }

 getflitervalue(val: any, data: any[], workspaceSample: { [x: string]: any; }){
       return data
      .map((checked, i) => checked ? workspaceSample[i] : null)
      .filter(v => v !== null);
 }
 

}