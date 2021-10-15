import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "@angular/common/http";
import { HttpParams } from '@angular/common/http/src/params';
import { Subject } from 'rxjs/Subject';

import "datatables.net";
import 'rxjs/add/operator/toPromise';

import { DataService, State, BusinessSegment } from "../../data.service";

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

    // Default Settings
    feeArr = this.dataService.getFeeArr(); //['FE00604', 'FE00614', 'FE00439', 'FE00462', 'FE00509', 'FE00514', 'FE00515', 'FE00687', 'FE00689'];
    pricingTypeArr = this.dataService.getMPricingTypeArr();  //['LP', 'TP'];      // Default checkbox selected value
    metricArr = this.dataService.getMMetricArr();      //['LPA', 'TPA'];        // Default checkbox selected value
    assetArr = this.dataService.getMAssetArr();  //['BT100AND199', 'LT2'];  // Default checkbox selected value
    segmentArr = this.dataService.getSegmentArr(); //['Commercial'];        // Default checkbox selected value

    selectedState = this.dataService.getSelectedState();
    selectedBusinessSegment = this.dataService.getSelectedBusinessSegment();

    errorMessage: any[];

    states: State[] = [];
    businesssegments: BusinessSegment[] = [];

    dtHiddenColumnIndexes: any = [];
    dtData: any[] = [];
    dtColumns: any[] = [];
    mainTableCustomColumnNames;
    tableColumns;
    table;

    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    constructor(private httpClient: HttpClient, private dataService: DataService) { }

    ngOnInit() {
        this.getProductFeeTree();
        this.getStates();
        this.getBusinessSegments();
        this.getMainTable(this.getApiMainPostData());
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

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message : error.status ? '${error.status} - ${error.statusText}' : 'Server error';
        alert(errMsg);
        console.error(errMsg);
    }

    filterDisplayOption(e: any) {
        let cellBankLpIdx, cellBankTpIdx
        cellBankLpIdx = $.inArray('Bank_LP', this.dtColumns);
        cellBankTpIdx = $.inArray('Bank_TP', this.dtColumns);

        this.table.rows().every((rowIdx, tableLoop, rowLoop) => {
            let rowNode = this.table.row(rowIdx).node();
            let cellNode, cellNodeVal;

            $.each(this.dtColumns, function (i, val) {
                if (cellBankLpIdx == i || cellBankTpIdx == i) return;

                let cellNodeA, cellNodeB;

                if (val.indexOf('Bank') > -1 || val.indexOf('Comp') > -1) {
                    // Get cell
                    let cellColumnA = 0;
                    let cellColumnB = 0;

                    if (val.indexOf('_LP') > -1) {
                        cellColumnA = cellBankLpIdx - 4;
                        cellNodeA = $(rowNode).find("td:eq(" + cellColumnA + ")");
                    } else {
                        cellColumnA = cellBankTpIdx - 4;
                        cellNodeA = $(rowNode).find("td:eq(" + cellColumnA + ")");
                    }

                    cellColumnB = i - 4;
                    cellNodeB = $(rowNode).find("td:eq(" + cellColumnB + ")");

                    cellNodeB.removeClass('bg-danger');
                    cellNodeB.removeClass('bg-primary');

                    if (cellNodeA[0] === undefined || cellNodeB[0] === undefined) return;

                    var valA = cellNodeA[0].innerText.replace('$', '').replace(',', '').replace('%', '');
                    var valB = cellNodeB[0].innerText.replace('$', '').replace(',', '').replace('%', '');

                    if (!$.isNumeric(valA) || !$.isNumeric(valB)) return;

                    // Force equal values to be evaluated before evaluated greater than condition below
                    if (valA === valB)
                        return;
                    if (valA > valB) {
                        if (e.target.id == "rShowRisks") cellNodeB.addClass('bg-danger');
                    } else {
                        if (e.target.id == "rShowOpps") cellNodeB.addClass('bg-primary');
                    };

                    return;
                }
            });
        });
    }

    filterPricingType() {
        let metricArr = [];
        let pricingTypeArr = [];

        if ($("input:checkbox[name=pricingType]:checked").length > 0) {
            $.each($("input:checkbox[name=pricingType]:checked"), function (x) {
                let val = $("input:checkbox[name=pricingType]:checked")[x].value;
                pricingTypeArr.push(val);
                $.each($("input:checkbox[name=metric]:checked"), function () {
                    metricArr.push(val + $(this).val());
                });
            });
        }
        else {
            $.each($("input:checkbox[name=pricingType]"), function (x) {
                let val = $("input:checkbox[name=pricingType]")[x].value;
                pricingTypeArr.push(val);
                $.each($("input:checkbox[name=metric]:checked"), function () {
                    metricArr.push(val + $(this).val());
                });
            });
        }

        this.metricArr = metricArr;
        this.pricingTypeArr = pricingTypeArr;

        this.dataService.setMMetricArr(this.metricArr);
        this.dataService.setMPricingTypeArr(this.pricingTypeArr);

        this.updatePageData();
    }

    filterMetricType(e: any) {
        let val;

        this.pricingTypeArr.forEach((element) => {
            val = element + e.target.value;
            if (e.target.checked) {
                this.metricArr.push(val);
            }
            else {
                let idx = this.metricArr.indexOf(val);
                this.metricArr.splice(idx, 1);
            }
        }, this);

        this.dataService.setMMetricArr(this.metricArr);

        this.updatePageData();
    }

    filterAssetSize(e: any) {
        // Asset Size
        //assetArr.push('GT100'); // = ['GT100'];
        //$("#cbGT200, #cbBT100AND199, #cbBT50AND99, #cbBT20AND49, #cbBT10AND19, #cbBT2AND9, #cbLT2").on('click', function (e) {
        let val = e.target.value;

        if (e.target.checked) {
            this.assetArr.push(val);
        }
        else {
            let idx = this.assetArr.indexOf(val);
            this.assetArr.splice(idx, 1);
        }
        //console.log(assetArr.toString());
        // loadTable(getApiMainPostData());
        //});

        this.dataService.setMAssetArr(this.assetArr);

        this.updatePageData();
    }

    initMainTable(): void {
        let idxArr = [];
        let columnArr = [];
        let mainTableCustomColumnNames = [];

        // let table;
        let mainDataTableColumnIdxToSort = 2
        let mainDataTableMaxColumns = 0;
        let mainTableQueryStr = '';

        // console.log(this.tableColumns);
        // console.log(this.dtColumns);
        // console.log(this.mainTableCustomColumnNames);
        // console.log(this.dtData);

        let tableHeaders = '';
        this.dtColumns.map((v, i) => {
            tableHeaders += "<th>" + this.mainTableCustomColumnNames[i] + "</th>";
            mainDataTableMaxColumns += 1;
        });

        $("#tableDiv").empty();
        $("#tableDiv").append('<table id="dataTables-main" class="table table-striped table-bordered table-hover dataTables-example animated fadeIn"><thead><tr>' + tableHeaders + '</tr></thead></table>');

        this.table = $('#dataTables-main').DataTable({
            data: this.dtData,
            columns: JSON.parse(this.tableColumns),
            dom: '<"html5buttons"B>lTfgitp',
            buttons: [
                { extend: 'copy', exportOptions: { columns: ':visible' } },
                { extend: 'csv', title: 'ListActualComparison', exportOptions: { columns: ':visible' } },
                { extend: 'excel', title: 'ListActualComparison', exportOptions: { columns: ':visible' } },
                { extend: 'pdf', title: 'ListActualComparison', exportOptions: { columns: ':visible' } },
                {
                    extend: 'print',
                    exportOptions: { columns: ':visible' },
                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                    }
                },
                // 'colvis'
            ],
            "columnDefs": [
                { targets: [0, 1, 2, 4], visible: false },
                {
                    targets: [3],
                    data: null,
                    render: function (data, type, full, meta) {
                        // Concatenate Fee and Tier text values.
                        let a, b;
                        a = full.Fee;
                        if (full.Tier)
                            b = ' : ' + full.Tier;
                        else
                            b = '';
                        return a + b;
                    }
                }
            ],
            responsive: false,
            "order": [[mainDataTableColumnIdxToSort, 'asc']],
            "paging": false,
            "fixedHeader": true,
            //"displayLength": 25,
            "drawCallback": function (settings) {
                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;
                // console.log(api);
                api.column(mainDataTableColumnIdxToSort, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {
                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="' + mainDataTableMaxColumns + '" style="background-color:#d9edf7">' + group + '</td></tr>'
                        );
                        last = group;
                    }
                });
            }
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

        // // Calling the DT trigger to manually render the table
        // this.dtTrigger.next();
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
                            // console.log(data[i]);
                        }
                    }

                    data[0].state = { opened: true };       // Open root on load

                    $('#jstree_products').jstree("destroy");

                    $('#jstree_products').jstree({
                        "plugins": ["checkbox"],
                        'core': {
                            'data': data,
                            'themes': { 'icons': false }
                        }
                    });

                    // console.log(data);
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

    getMainTable(postData: any) {
        // let idxArr = [];
        let columnArr = [];
        let mainTableCustomColumnNames = [];

        // let table;
        let mainDataTableColumnIdxToSort = 2
        let mainDataTableMaxColumns = 0;
        let mainTableQueryStr = '';

        // console.log(postData);

        Observable.forkJoin([
            this.dataService.getMainTableCustomColumnNamesData(postData),
            this.dataService.getMainTable(postData)
        ])
            .subscribe(
                result => {
                    let columnData, data;
                    columnData = result[0];
                    data = result[1];

                    // console.log(columnData);
                    // console.log(data);

                    function findCustomColumnName(col: any, obj: any): string {
                        var retVal = ''; // col;
                        for (var i = 0; i < obj.length; i++) {
                            if (obj[i].ColName == col) {
                                //console.log(obj[i].ColName + '=' + col);
                                retVal = obj[i].ColDesc;
                                break;
                            }
                        }
                        return retVal;
                    }

                    // Identify columns in dataset with "(hidden)" and remove
                    $.each(Object.keys(data[0]), function (i, val) {
                        // if (json[0][val] == '(No Data)') {
                        if (data[0][val] == '(hidden)') {
                            delete data[0][val];
                        }
                    });


                    // Collect and create column json dataset and datatable header row
                    var tableHeaders = '';
                    let tableColumns = '[';
                    $.each(Object.keys(data[0]), function (i, val) {
                        tableColumns += ' { "data" : "' + val + '" },';
                        //tableHeaders += "<th>" + findCustomColumnName(val, columnData) + "</th>";
                        columnArr.push(val);
                        mainTableCustomColumnNames.push(findCustomColumnName(val, columnData));
                        mainDataTableMaxColumns += 1;
                    });
                    tableColumns = tableColumns.substring(0, tableColumns.length - 1) + ' ] ';
                    this.tableColumns = tableColumns;
                    this.dtColumns = columnArr;
                    this.mainTableCustomColumnNames = mainTableCustomColumnNames
                    this.dtData = data;

                    //if (firstLoad)
                    this.initMainTable();

                },
                error => {
                    this.errorMessage = <any>error;
                    alert('Error calling dataService.getStates(): ' + error)
                }
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

    updatePageData() {
        let postData = this.getApiMainPostData();
        this.getMainTable(postData);
    }

    selectStateChanged(e: any) {
        this.selectedState = e.target.value;
        this.dataService.setSelectedState(this.selectedState);
        this.updatePageData();
    }

    selectBusinessSegmentChanged(e: any) {
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


}

