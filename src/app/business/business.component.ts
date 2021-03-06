
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';
import { PerfIndicatorService } from '../services/perf-indicator.service';
import { CircleProgressComponent } from 'shared/circle-progress.component';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TenantService, } from '../services/tenant.service';
import { WidgetStats } from './WidgetStats';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { UserDetails } from '../models/userDetails';
import { TenantDetails } from '../models/tenantDetails';


@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  providers: [AlertService, PerfIndicatorService, ConfirmationService]
})


export class BusinessComponent implements OnInit {
  tenantid = "";
  putTenantSetting = {};
  tenant_items_all: SelectItem[];
  classname = "";
  WidgetStats: WidgetStats[] = [];;
  display = false;
  tenants_items = [];

  userDetails: UserDetails = {
    id: "",
    tenantId: ""

  }
  tenantDetails: TenantDetails = {
    banner: "",
    logo: "",
    id: "",
    healthitems: [""]
  }

  selectedItem1 = "";
  selectedItem2 = ""
  selectedItem3 = "";
  health_items = [];
  health_items_top3 = [];

  public alert_trend;
  public data;
  public sgopt;
  public svcWidgets = [];
  public dashboardurl;
  public tenantId;

  constructor(private userService: UserService, private tenantService: TenantService, private confirmationService: ConfirmationService, private perfIndicatorsService: PerfIndicatorService, private alertsService: AlertService, private sanitizer: DomSanitizer) {



    this.sgopt = {
      scales: {
        xAxes: [{ display: false }],
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true
          }
        }]
      },
      tooltips: {
        enabled: false
      },
      legend: {
        display: false
      }
    }
  }
  confirm() {
    this.display = true;
  }

  onSubmit() {
    this.putTenantSetting = {

      "healthitems": [this.selectedItem1, this.selectedItem2, this.selectedItem3],
    }

    this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
    this.tenantId = this.userDetails.tenantId.toString();

    this.tenantService.updateTenant(this.putTenantSetting).subscribe(res => {

    },
      err => { console.log(err); });

  }

  ngOnInit() {

    if (localStorage.getItem("userDetails") && localStorage.getItem("userDetails") !== null) {
      this.userDetails = JSON.parse(localStorage.getItem("userDetails"));
    }

    this.tenantId = this.userDetails.tenantId;

    console.log("Business component tentid" + this.tenantId);

    this.alertsService.getAlertTrends('12', this.tenantId)
      .subscribe((data: any) => {

        this.alert_trend = data;
      });

    this.tenantService.getTenantDetails().subscribe(res => {
      this.health_items_top3 = res.message[0].healthitems;
      console.log(this.health_items_top3)
      if (this.health_items_top3.length == 0) {
        this.WidgetStats.push({
          "name": "xView",
          "class_name": "c100 p100 dark",
          "color": "dark",
          "health_value": 0
        });
    
        this.WidgetStats.push({
          "name": "xOps.it",
          "class_name": "c100 p100 dark",
          "color": "dark",
          "health_value": 0
        });
    
        this.WidgetStats.push({
          "name": "xOps Army",
          "class_name": "c100 p100 dark",
          "color": "dark",
          "health_value": 0
        });
      }

      this.perfIndicatorsService.getHealth(this.tenantId)
        .subscribe(res2 => {

          for (var array_top3 of this.health_items_top3) {


            for (var array of res2["metrics"]) {

              if (array.id == array_top3) {
                this.svcWidgets.push(array);

              }
            }
          }

          for (var title of this.svcWidgets) {
            var classv = "c100 p100 " + title.status;

            this.WidgetStats.push({
              "name": title.id,
              "class_name": classv,
              "color": title.status,
              "health_value": title.health_value
            });

          }


          console.log(this.WidgetStats)
        });
    })
    this.classname = "c100 p95 green big";

    this.tenant_items_all = [];
    this.tenant_items_all.push({ label: "Select Item", value: "Select_Item" });


    this.perfIndicatorsService.getHealth(this.tenantId)
      .subscribe(res => {

        for (var arr of res["metrics"]) {
          this.tenant_items_all.push({ label: arr.id, value: arr.id });

        }
      }
      );



  }

}
