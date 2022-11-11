import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-initiator',
  templateUrl: './initiator.component.html',
  styleUrls: ['./initiator.component.css']
})
export class InitiatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    
  }

// tabHide :string ="initiator";

//   tabChange(arg :string){
//      if(arg === 'initiator'){
//       // this.childComponenet = "app-initiatorpage" 
//       this.tabHide ="initiator"
//      }
//      if(arg === 'inbox'){
//       this.tabHide ="inbox"
//     }
//     if(arg === 'search'){
//       this.tabHide ="search"
//     }
//   }
}
