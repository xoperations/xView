import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { config } from '../config/config';
import { UserDetails } from '../models/userDetails';

@Component({
  selector: 'app-logsearch',
  templateUrl: './logsearch.component.html',
  styleUrls: ['./logsearch.component.scss'],
  providers: [AlertService]
})

export class LogsearchComponent implements OnInit {

  public logsearchurl;
  public searchq = "";
  tenant_id : String;
  tenant_id1 : String;
  // toggle iframe 
  private search: boolean = true;

  user = {
    name: "",
    picture: "",
    tenantId: ""
  };

  userDetails: UserDetails = {
    id: "",
    tenantId:""
  }

  constructor(private userService: UserService, private alertsService: AlertService, private sanitizer: DomSanitizer) {
  }

  onSearch(searchLogsForm) {
    if (localStorage.getItem("userDetails")!==null) {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
    }

    this.tenant_id = this.userDetails.tenantId;

      this.searchq = '';
      this.logsearchurl = '';

      // hide iframe
      if (this.search == true) {

        this.searchq = encodeURI(searchLogsForm.value.searchq);
        this.logsearchurl = this.sanitizer.bypassSecurityTrustResourceUrl(config.elasticsearchurl+":5601/app/kibana#/dashboard/bc4967a0-311d-11e8-a6f3-89d2ed85775d?embed=true&embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(description:'',filters:!(),options:(darkTheme:!f),panels:!((col:1,columns:!(_source),id:'6110e570-311d-11e8-a6f3-89d2ed85775d',panelIndex:1,row:1,size_x:12,size_y:5,sort:!('@timestamp',desc),type:search)),query:(query_string:(analyze_wildcard:!t,query:'_index:%22logs-" + this.tenant_id + "-%22*+AND+" + this.searchq + "')),timeRestore:!f,title:'Logs+Dashboard',uiState:(),viewMode:view)");
        this.search = false;
      }
      else {
        this.searchq = encodeURI(searchLogsForm.value.searchq);
        this.logsearchurl = this.sanitizer.bypassSecurityTrustResourceUrl(config.elasticsearchurl+":5601/app/kibana#/dashboard/bc4967a0-311d-11e8-a6f3-89d2ed85775d?embed=true&embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(description:'',filters:!(),options:(darkTheme:!f),panels:!((col:1,columns:!(_source),id:'6110e570-311d-11e8-a6f3-89d2ed85775d',panelIndex:1,row:1,size_x:12,size_y:5,sort:!('@timestamp',desc),type:search)),query:(query_string:(analyze_wildcard:!t,query:'_index:%22logs-" + this.tenant_id + "-%22*+AND+" + this.searchq + "')),timeRestore:!f,title:'Logs+Dashboard',uiState:(),viewMode:view)");

        this.search = true;
      }

  }
  ngOnInit() {
    if (localStorage.getItem("userDetails")!==null) {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
    }

    this.tenant_id1 = this.userDetails.tenantId;
      this.logsearchurl = this.sanitizer.bypassSecurityTrustResourceUrl(config.elasticsearchurl+":5601/app/kibana#/dashboard/bc4967a0-311d-11e8-a6f3-89d2ed85775d?embed=true&embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d,mode:quick,to:now))&_a=(description:'',filters:!(),options:(darkTheme:!f),panels:!((col:1,columns:!(_source),id:'6110e570-311d-11e8-a6f3-89d2ed85775d',panelIndex:1,row:1,size_x:12,size_y:5,sort:!('@timestamp',desc),type:search)),query:(query_string:(analyze_wildcard:!t,query:'_index:%22logs-" + this.tenant_id1 + "-%22*')),timeRestore:!f,title:'Logs+Dashboard',uiState:(),viewMode:view)");
 
  }




}

