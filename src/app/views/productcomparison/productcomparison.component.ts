import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "@angular/common/http";
import { HttpParams } from '@angular/common/http/src/params';
import { Subject } from 'rxjs/Subject';
import { Chart } from 'chart.js';

import "datatables.net";
import 'rxjs/add/operator/toPromise';


import { DataService, State, BusinessSegment } from "../../data.service";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-productcomparison',
  templateUrl: './productcomparison.component.html',
  styleUrls: ['./productcomparison.component.css']
})
export class ProductcomparisonComponent implements OnInit, AfterViewInit {

  // Default Settings
  feeArr = this.dataService.getFeeArr(); //['FE00604', 'FE00614', 'FE00439', 'FE00462', 'FE00509', 'FE00514', 'FE00515', 'FE00687', 'FE00689'];
  pricingTypeArr = this.dataService.getCPricingTypeArr(); //['LP'];       // Default checkbox selected value
  metricArr = this.dataService.getCMetricArr();  //['LPA'];         // Default checkbox selected value
  assetArr = this.dataService.getCAssetArr(); //['BT100AND199'];  // Default checkbox selected value
  segmentArr = this.dataService.getSegmentArr(); //['Commercial'];        // Default checkbox selected value

  selectedState = this.dataService.getSelectedState();
  selectedBusinessSegment = this.dataService.getSelectedBusinessSegment();

  errorMessage: any[];

  states: State[] = [];
  businesssegments: BusinessSegment[] = [];

  // Charts
  productComparisonChart;
  productDiffChart;
  table;


  constructor(private httpClient: HttpClient, private dataService: DataService) { }

  ngOnInit() {
    this.getProductFeeTree();
    this.getStates();
    this.getBusinessSegments();
    this.getProductComparison(this.getApiMainPostData());
  }

  ngAfterViewInit() {
    $(".select2_state").select2({
      placeholder: "Select a state",
      allowClear: false,
      minimumResultsForSearch: 10,
      responsive: true,
      width: "100%"
    });

    $(".select2_businesssegment").select2({
      placeholder: "Select a segment",
      allowClear: false,
      minimumResultsForSearch: 10,
      responsive: true,
      width: "100%"
    });

    $('.select2_state').on('select2:select', (e) => {
      this.selectStateChanged(e);
    });

    $('.select2_businesssegment').on('select2:select', (e) => {
      this.selectBusinessSegmentChanged(e);
    });
  }

  getProductFeeTree(): void {
    this.dataService.getProductFeeTree()
      .subscribe(
        data => {
          for (var i = 0; i < data.length; i++) {
            delete data[i]['FeeOrder'];         // Remove "FeeOrder" column, not apart of expected object
            if (this.feeArr.includes(data[i].id)) {
              // if (this.feeArr[0].indexOf(data[i].id) > -1) {
              data[i].state = { selected: true };
            }
          }

          data[0].state = { opened: true };       // Open root on load

          $('#jstree_products').jstree({
            "plugins": ["checkbox"],
            'core': {
              'data': data,
              'themes': { 'icons': false }
            }
          });
        },
        error => this.handleError(error)
      )
  }

  getStates(): void {
    this.dataService.getStates()
      .subscribe(
        data => {
          this.states = data;
          // console.log('states: '); 
          // console.log(data); 
        },
        error => this.handleError(error)
      )
  }

  getBusinessSegments(): void {
    this.dataService.getBusinessSegments()
      .subscribe(
        data => {
          this.businesssegments = data;
        },
        error => this.handleError(error)
      )
  }

  getApiMainPostData() {
    return {
      "fees": this.feeArr.length > 0 ? this.feeArr.toString() : [],
      "states": this.selectedState,
      "metrics": [].concat.apply(this.pricingTypeArr, this.metricArr).length > 0 ? [].concat.apply(this.pricingTypeArr, this.metricArr).toString() : [],
      "assets": this.assetArr.length > 0 ? this.assetArr.toString() : [],
      "segment": this.selectedBusinessSegment
    };
  }

  getProductComparison(postData: any) {
    $("#tableDivComparison").empty();
    $("#tableDivComparison").append('<table id="dataTables-comparison" class="table table-striped table-bordered table-hover dataTables-example animated fadeIn"><thead><tr><th></th><th>Client</th><th>Competitor</th><th>Difference</th></tr></thead></table>');


    $('#divLineChartProductComparison').empty();
    $('#divLineChartProductComparison').append('<canvas id="lineChartProductComparison" style="min-height: 80px"></canvas>');

    $('#divRadarChartProductComparison').empty();
    $('#divRadarChartProductComparison').append('<canvas id="radarChartProductComparison" height="240"></canvas>');

    if (typeof this.table != 'undefined') {
      this.table.destroy();
    }

    this.dataService.getProductcomparison(postData)
      .subscribe(
        data => {
          let horizontalBarData = data["ProductComparison"][0]["horizontalBar"]
          let comparisonTableData = data["ProductComparison"][1]["comparisonTable"]
          let radarGraphData = data["ProductComparison"][2]["radarGraph"]

          // Horizontal Bar Chart
          var ctx = document.getElementById("lineChartProductComparison");
          this.productComparisonChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarData,
            responsive: true,
            options: {
              title: {
                display: true,
                text: 'Product Comparison'
              },
              tooltips: {
                callbacks: {
                  label: (tooltipItem, data) => {
                    return "$" + Number(tooltipItem.xLabel).toFixed(2);
                  }
                }
              },
              scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    userCallback: (value, index, values) => {
                      // Convert the number to a string and splite the string every 3 charaters from the end
                      value = value.toString();
                      value = value.split(/(?=(?:...)*$)/);
                      // Convert the array to a string and format the output
                      value = value.join('.');
                      return '$' + value;
                    }
                  }
                }]
              }
            }
          });

          // Radar
          var ctxRadar = document.getElementById("radarChartProductComparison");
          this.productDiffChart = new Chart(ctxRadar, {
            type: "radar",
            data: radarGraphData,
            responsive: true,
            options: {
              legend: {
                labels: {
                  filter: (legendItem, chartData) => {
                    // return true or false based on legendItem's datasetIndex (legendItem.datasetIndex)
                    //console.log(legendItem);
                    if (legendItem.text == 'RangeDiff')
                      return false;
                    else
                      return true;
                  }
                }
              },
              tooltips: {
                callbacks: {
                  label: (tooltipItem, data) => {
                    return parseFloat(tooltipItem.yLabel).toFixed(2).toString() + ' %';
                  }
                }
              },
              // String - Template string for single tooltips
              tooltipTemplate: "<%if (label){%><%=label %>: <%}%><%= value + ' %' %>",
              // String - Template string for multiple tooltips
              multiTooltipTemplate: "<%= value + ' %' %>",
              title: {
                display: true,
                text: '% Difference'
              },
              scale: {
                ticks: {
                  // min: -30,
                  // max: 30,
                  // stepSize: 10,
                  // Include a dollar sign in the ticks
                  callback: (value, index, values) => {
                    return parseFloat(value).toFixed(2).toString() + ' %';
                  }
                }
              }
            }
          });

          // Datatable
          this.table = $('#dataTables-comparison').DataTable({
            data: comparisonTableData,
            columns: [
              { data: 'Fee' },
              { data: 'Pricing1' },
              { data: 'Pricing2' },
              {
                data: 'Diff',
                render: function (data, type, full, meta) {
                  return + data + ' %';
                }
              }
            ],
            dom: '<"html5buttons"B>lTfgitp',
            buttons: [
              { extend: 'copy' },
              { extend: 'csv' },
              { extend: 'excel', title: 'Product Comparison' },
              { extend: 'pdf', title: 'Product Comparison' },
              {
                extend: 'print',
                customize: function (win) {
                  $(win.document.body).addClass('white-bg');
                  $(win.document.body).css('font-size', '10px');
                  $(win.document.body).find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit');
                }
              }
            ],
            "columnDefs": [
              { "className": "dt-body-right", "targets": [1, 2, 3] },
              {
                targets: [0],
                data: null,
                render: function (data, type, full, meta) {
                  // Concatenate Fee and Tier text values.
                  let a, b;
                  a = full.Fee;
                  if (full.Tier)
                    b = ': ' + full.Tier;
                  else
                    b = '';
                  return a + b;
                }
              }

            ],
            "paging": false,
            "pageLength": 10,
            "lengthChange": false,
            "ordering": true,
            "info": false,
            "searching": true
          });

          // jquery hack for css
          $(this.table.table().container()).addClass('form-inline dt-bootstrap');
          $(this.table.table().container()).find('table').removeClass('no-footer');
          $(this.table.table().container()).find('input').addClass('form-control input-sm');
          $(this.table.table().container()).find('.dt-buttons').addClass('btn-group');
          $(this.table.table().container()).find('.buttons-copy').removeClass('dt-button').addClass('btn btn-default').css('padding', '6px 8px').css('font-size', '12px');
          $(this.table.table().container()).find('.buttons-csv').removeClass('dt-button').addClass('btn btn-default').css('padding', '6px 8px').css('font-size', '12px');
          $(this.table.table().container()).find('.buttons-excel').removeClass('dt-button').addClass('btn btn-default').css('padding', '6px 8px').css('font-size', '12px');
          $(this.table.table().container()).find('.buttons-pdf').removeClass('dt-button').addClass('btn btn-default').css('padding', '6px 8px').css('font-size', '12px');
          $(this.table.table().container()).find('.buttons-print').removeClass('dt-button').addClass('btn btn-default').css('padding', '6px 8px').css('font-size', '12px');

        },
        error => this.handleError(error)
      )
  }

  filterPricingType(e: any) {
    let val = e.target.value;

    if (val == 'LPTP') {
      this.pricingTypeArr = ['LP,TPX' + $('input[name="metric"]:checked').val()]; // NOTE: Using TPX to denote Client Trans Price with metrics.  ie: TPXA = Client Trans Price Avg
      this.metricArr = [];
    }
    else {
      this.pricingTypeArr = [val];     // Single Selection
      var metricVal = $('input[name="metric"]:checked').val();
      // metricVal = (metricVal === undefined) ? 'A' : metricVal;
      // console.log(metricVal);
      this.metricArr = [val + metricVal];  // Single Selection
    }

    // let metricArr = [];
    // let pricingTypeArr = [];

    // if ($("input:checkbox[name=pricingType]:checked").length > 0) {
    //   $.each($("input:checkbox[name=pricingType]:checked"), function (x) {
    //     let val = $("input:checkbox[name=pricingType]:checked")[x].value;
    //     pricingTypeArr.push(val);
    //     $.each($("input:checkbox[name=metric]:checked"), function () {
    //       metricArr.push(val + $(this).val());
    //     });
    //   });
    // }
    // else {
    //   $.each($("input:checkbox[name=pricingType]"), function (x) {
    //     let val = $("input:checkbox[name=pricingType]")[x].value;
    //     pricingTypeArr.push(val);
    //     $.each($("input:checkbox[name=metric]:checked"), function () {
    //       metricArr.push(val + $(this).val());
    //     });
    //   });
    // }

    // this.metricArr = metricArr;
    // this.pricingTypeArr = pricingTypeArr;

    this.dataService.setCMetricArr(this.metricArr);
    this.dataService.setCPricingTypeArr(this.pricingTypeArr);

    console.log(this.dataService.getCMetricArr());
    console.log(this.dataService.getCPricingTypeArr());

    this.updatePageData();
  }

  filterMetricType(e: any) {
    let val;

    this.pricingTypeArr.forEach((element) => {

      if (element.indexOf('LP,TPX') > -1) {
        // console.log("Here");
        // metricArr =[];
        this.pricingTypeArr = ['LP,TPX' + e.target.value];
        return;
      }

      val = element + e.target.value;

      this.metricArr = [val];  // Single Selection

      // if (e.target.checked) {
      //   this.metricArr.push(val);
      // }
      // else {
      //   let idx = this.metricArr.indexOf(val);
      //   this.metricArr.splice(idx, 1);
      // }

    }, this);

    this.dataService.setCMetricArr(this.metricArr);
    this.dataService.setCPricingTypeArr(this.pricingTypeArr);

    console.log(this.dataService.getCMetricArr());
    console.log(this.dataService.getCPricingTypeArr());

    this.updatePageData();
  }

  filterAssetSize(e: any) {
    // Asset Size
    //assetArr.push('GT100'); // = ['GT100'];
    //$("#cbGT200, #cbBT100AND199, #cbBT50AND99, #cbBT20AND49, #cbBT10AND19, #cbBT2AND9, #cbLT2").on('click', function (e) {
    let val = e.target.value;

    this.assetArr = [val];   // Single Selection

    // if (e.target.checked) {
    //   this.assetArr.push(val);
    // }
    // else {
    //   let idx = this.assetArr.indexOf(val);
    //   this.assetArr.splice(idx, 1);
    // }

    this.dataService.setCAssetArr(this.assetArr);

    this.updatePageData();
  }

  updatePageData() {
    let postData = this.getApiMainPostData();
    this.getProductComparison(postData);
  }

  selectStateChanged(e) {
    this.selectedState = e.target.value;
    this.dataService.setSelectedState(this.selectedState);
    this.updatePageData();
  }

  selectBusinessSegmentChanged(e) {
    this.selectedBusinessSegment = e.target.value;
    this.dataService.setSelectedBusinessSegment(this.selectedBusinessSegment);
    this.updatePageData();
  }

  productGroupClick() {
    let selectedProductGroup = $(".select_productgroup option:selected").text();
    if (selectedProductGroup === 'Top Billing Codes') {
      this.feeArr = this.dataService.getTopBillingFee();
      this.getProductFeeTree();
    }
  }

  productSelectionClick() {
    let selectedArray = $('#jstree_products').jstree('get_selected', true);
    this.feeArr = [];

    selectedArray.map((i, val) => {
      if (selectedArray[val].id.indexOf("FE") >= 0 || selectedArray[val].id.indexOf("EC") >= 0) {
        this.feeArr.push(selectedArray[val].id);
      }
    });

    $("#modalProductSelection").modal('hide');

    this.dataService.setFeeArr(this.feeArr);

    // console.log(this.feeArr);
    this.updatePageData();
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? '${error.status} - ${error.statusText}' : 'Server error';
    alert(errMsg);
    console.error(errMsg);
  }


}
