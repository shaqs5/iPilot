import { Component, OnInit, AfterViewInit } from '@angular/core';

// Charts
import * as Chart from 'chart.js'

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

    canvas: any;
    ctx: any;

    constructor() { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // dashboard-chart
        var ctx = document.getElementById("dashboard-chart1");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    "January 2016"
                    , "January 2017"
                    , "January 2018"
                ],
                datasets: [{
                    type: "line",
                    label: "FI's Assets $50B+ Balances $1-$100K",
                    data: [
                        0.210949367,
                        0.201823899,
                        0.239386076

                    ],
                    backgroundColor: 'rgba(0,0,255, 0.2)',
                    borderColor: 'rgba(0,0,255,1)',
                    borderWidth: 1
                },
                {
                    type: "line",
                    label: "FI's Assets $50B+ Balances $100K+",
                    data: [
                        0.235253165,
                        0.232327044,
                        0.2735


                    ],
                    backgroundColor: 'rgba(255,0,0, 0.2)',
                    borderColor: 'rgba(255,0,0,1)',
                    borderWidth: 1
                },
                {
                    type: "line",
                    label: "FI's Assets Under $50B Balances $1-$100K",
                    data: [
                        0.237132467,
                        0.259121638,
                        0.34488946



                    ],
                    backgroundColor: 'rgba(46,139,87, 0.2)',
                    borderColor: 'rgba(46,139,87,1)',
                    borderWidth: 1
                },
                {
                    type: "line",
                    label: "FI's Assets Under $50B Balances $100K+",
                    data: [
                        0.278552025,
                        0.30090781,
                        0.393863003



                    ],
                    backgroundColor: 'rgba(75,0,130, 0.2)',
                    borderColor: 'rgba(75,0,130, 1)',
                    borderWidth: 1
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: "Earnings Credit Rate National Averages"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var ctx = document.getElementById("dashboard-chart2");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    "January 2016"
                    , "January 2017"
                    , "January 2018"
                ],
                datasets: [{
                    type: "line",
                    label: 'Hybrid Interest $1-$100K',
                    data: [
                        0.142895484,
                        0.077178101,
                        0.120960891
                    ],
                    backgroundColor: 'rgba(0,0,255, 0.2)',
                    borderColor: 'rgba(0,0,255,1)',
                    borderWidth: 1
                },
                {
                    type: "line",
                    label: 'Hybrid Interest  $100K+',
                    data: [
                        0.144508387,
                        0.077811013,
                        0.144228218

                    ],
                    backgroundColor: 'rgba(255,0,0, 0.2)',
                    borderColor: 'rgba(255,0,0,1)',
                    borderWidth: 1
                },
                {
                    type: "line",
                    label: 'Hybrid ECR $1-$100K',
                    data: [
                        0.214088889,
                        0.185866667,
                        0.2045


                    ],
                    backgroundColor: 'rgba(46,139,87, 0.2)',
                    borderColor: 'rgba(46,139,87,1)',
                    borderWidth: 1
                },
                {
                    type: "line",
                    label: 'Hybrid ECR $100K+',
                    data: [
                        0.234311111,
                        0.224311111,
                        0.250846154


                    ],
                    backgroundColor: 'rgba(75,0,130, 0.2)',
                    borderColor: 'rgba(75,0,130, 1)',
                    borderWidth: 1
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: "Hybrid Interest and Earnings Credit Rates FI's $50B +"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


        //  this.canvas = document.getElementById('dashboard-chart');
        //     this.ctx = this.canvas.getContext('2d');
        //     let myChart = new Chart(this.ctx, {
        //       type: 'pie',
        //       data: {
        //           labels: ["New", "In Progress", "On Hold"],
        //           datasets: [{
        //               label: '# of Votes',
        //               data: [1,2,3],
        //               backgroundColor: [
        //                   'rgba(255, 99, 132, 1)',
        //                   'rgba(54, 162, 235, 1)',
        //                   'rgba(255, 206, 86, 1)'
        //               ],
        //               borderWidth: 1
        //           }]
        //       },
        //       options: {
        //         responsive: false,
        //         display:true
        //       }
        //     });
    }

    public lineChartData: Array<any> = [
        {
            data: [
                0.2325
                , 0.228333333
                , 0.22625
                , 0.223333333
                , 0.222916667
                , 0.222916667
                , 0.221666667
                , 0.221666667
                , 0.221666667
                , 0.221666667
                , 0.2175
                , 0.2175
                , 0.2175
                , 0.2175
                , 0.221666667
                , 0.221666667
                , 0.221666667
                , 0.221666667
                , 0.22125
                , 0.219166667
                , 0.219166667
                , 0.219166667
                , 0.219166667
                , 0.219166667
                , 0.219166667
                , 0.2275
                , 0.2275
                , 0.220416667
                , 0.225416667
                , 0.225416667
                , 0.225416667
                , 0.226666667

            ], label: '$100K'
        }
    ];
    public lineChartLabels: Array<any> = [
        "1/19/2015"
        , "2/19/2015"
        , "3/19/2015"
        , "4/19/2015"
        , "5/19/2015"
        , "6/19/2015"
        , "7/19/2015"
        , "8/19/2015"
        , "9/19/2015"
        , "10/19/2015"
        , "11/19/2015"
        , "12/19/2015"
        , "1/19/2016"
        , "2/19/2016"
        , "3/19/2016"
        , "4/19/2016"
        , "5/19/2016"
        , "6/19/2016"
        , "7/19/2016"
        , "8/19/2016"
        , "9/19/2016"
        , "10/19/2016"
        , "11/19/2016"
        , "12/19/2016"
        , "1/19/2017"
        , "2/19/2017"
        , "3/19/2017"
        , "4/19/2017"
        , "5/19/2017"
        , "6/19/2017"
        , "7/19/2017"
        , "8/19/2017"
    ];

    public lineChartType: string = 'line';

    public lineChartColors: Array<any> = [
        {
            backgroundColor: "rgba(26,179,148,0.5)",
            borderColor: "rgba(26,179,148,0.7)",
            pointBackgroundColor: "rgba(26,179,148,1)",
            pointBorderColor: "#fff",
        }
    ];






    // // dashboard-chart
    // var ctx = document.getElementById("dashboard-chart");
    // new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: [
    //             "1/19/2015"
    //             , "2/19/2015"
    //             , "3/19/2015"
    //             , "4/19/2015"
    //             , "5/19/2015"
    //             , "6/19/2015"
    //             , "7/19/2015"
    //             , "8/19/2015"
    //             , "9/19/2015"
    //             , "10/19/2015"
    //             , "11/19/2015"
    //             , "12/19/2015"
    //             , "1/19/2016"
    //             , "2/19/2016"
    //             , "3/19/2016"
    //             , "4/19/2016"
    //             , "5/19/2016"
    //             , "6/19/2016"
    //             , "7/19/2016"
    //             , "8/19/2016"
    //             , "9/19/2016"
    //             , "10/19/2016"
    //             , "11/19/2016"
    //             , "12/19/2016"
    //             , "1/19/2017"
    //             , "2/19/2017"
    //             , "3/19/2017"
    //             , "4/19/2017"
    //             , "5/19/2017"
    //             , "6/19/2017"
    //             , "7/19/2017"
    //             , "8/19/2017"
    //         ],
    //         datasets: [{
    //             type: "line",
    //             label: '$100K',
    //             data: [

    //                 0.2325
    //                 , 0.228333333
    //                 , 0.22625
    //                 , 0.223333333
    //                 , 0.222916667
    //                 , 0.222916667
    //                 , 0.221666667
    //                 , 0.221666667
    //                 , 0.221666667
    //                 , 0.221666667
    //                 , 0.2175
    //                 , 0.2175
    //                 , 0.2175
    //                 , 0.2175
    //                 , 0.221666667
    //                 , 0.221666667
    //                 , 0.221666667
    //                 , 0.221666667
    //                 , 0.22125
    //                 , 0.219166667
    //                 , 0.219166667
    //                 , 0.219166667
    //                 , 0.219166667
    //                 , 0.219166667
    //                 , 0.219166667
    //                 , 0.2275
    //                 , 0.2275
    //                 , 0.220416667
    //                 , 0.225416667
    //                 , 0.225416667
    //                 , 0.225416667
    //                 , 0.226666667

    //             ],
    //             backgroundColor: 'rgba(0,0,255, 0.2)',
    //             borderColor: 'rgba(0,0,255,1)',
    //             borderWidth: 1
    //         },
    //         {
    //             type: "line",
    //             label: '90 Day T-Bill',
    //             data: [
    //                 0.04
    //                 , 0.02
    //                 , 0.02
    //                 , 0.04
    //                 , 0.02
    //                 , 0.01
    //                 , 0.02
    //                 , 0.08
    //                 , 0.10
    //                 , 0.02
    //                 , 0.11
    //                 , 0.22
    //                 , 0.27
    //                 , 0.36
    //                 , 0.33
    //                 , 0.30
    //                 , 0.22
    //                 , 0.35
    //                 , 0.26
    //                 , 0.29
    //                 , 0.34
    //                 , 0.32
    //                 , 0.36
    //                 , 0.50
    //                 , 0.54
    //                 , 0.52
    //                 , 0.52
    //                 , 0.80
    //                 , 0.86
    //                 , 0.98
    //                 , 1.06
    //                 , 1.09
    //             ],
    //             backgroundColor: 'rgba(255,0,0, 0.2)',
    //             borderColor: 'rgba(255,0,0,1)',
    //             borderWidth: 1
    //         },
    //         {
    //             type: "line",
    //             label: 'Fed Funds',
    //             data: [
    //                  0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.25
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.50
    //                 , 0.75
    //                 , 0.75
    //                 , 0.75
    //                 , 1.00
    //                 , 1.00
    //                 , 1.00
    //                 , 1.25
    //                 , 1.25

    //             ],
    //             backgroundColor: 'rgba(46,139,87, 0.2)',
    //             borderColor: 'rgba(46,139,87,1)',
    //             borderWidth: 1
    //         },
    //         {
    //             type: "line",
    //             label: 'Libor',
    //             data: [
    //                  0.36
    //                 , 0.36
    //                 , 0.40
    //                 , 0.40
    //                 , 0.41
    //                 , 0.42
    //                 , 0.45
    //                 , 0.51
    //                 , 0.54
    //                 , 0.53
    //                 , 0.57
    //                 , 0.68
    //                 , 0.84
    //                 , 0.86
    //                 , 0.89
    //                 , 0.90
    //                 , 0.91
    //                 , 0.98
    //                 , 0.92
    //                 , 1.16
    //                 , 1.25
    //                 , 1.26
    //                 , 1.25
    //                 , 1.29
    //                 , 1.32
    //                 , 1.35
    //                 , 1.42
    //                 , 1.43
    //                 , 1.44
    //                 , 1.42
    //                 , 1.47
    //                 , 1.45

    //             ],
    //             backgroundColor: 'rgba(75,0,130, 0.2)',
    //             borderColor: 'rgba(75,0,130, 1)',
    //             borderWidth: 1
    //         }
    //         ]
    //     },
    //     options: {
    //         title: {
    //             display: true,
    //             text: 'ECR List Pricing - January 2015 - January 2017'
    //         },
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // });

}






