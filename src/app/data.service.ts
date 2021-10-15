import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import "rxjs/Rx";
import { error } from 'util';
import { AuthService } from './services/auth.service';

@Injectable()
export class DataService {

    // private rootUrl = "http://dev.informars.com/TRex/";
    // private apiVer = "apidev/";
    // private apiUrl = this.rootUrl + this.apiVer;
    private apiUrl = "http://trex.informars.com/api/";

    private TopBillingFee = ['FE00439', 'FE00441', 'FE00443', 'FE00445', 'FE00463', 'FE00524', 'FE00525', 'FE00526', 'FE00527', 'FE00530', 'FE00531', 'FE00532',
        'FE00533', 'FE00550', 'FE00580', 'FE00604', 'FE00605', 'FE00606', 'FE00607', 'FE00608', 'FE00614', 'FE00721', 'FE00730', 'FE00788',
        'FE00789', 'FE00790', 'FE00820', 'FE00821', 'FE00822', 'FE00823', 'FE00960', 'FE00961', 'FE00962', 'FE00969', 'FE00976', 'FE00977'];

    // Default Settings
    // //main default
    private feeArr = ['FE00604', 'FE00614', 'FE00439', 'FE00462', 'FE00509', 'FE00514', 'FE00515', 'FE00687', 'FE00689'];
    private mPricingTypeArr = ['LP', 'TP'];      // Default checkbox selected value
    private mMetricArr = ['LPA', 'TPA'];         // Default checkbox selected value
    private mAssetArr = ['BT100AND199', 'LT2'];  // Default checkbox selected value
    private segmentArr = ['Commercial'];        // Default checkbox selected value

    private selectedState = 'CA';
    private selectedBusinessSegment = 'Commercial';

    // // product comparison default
    // private feeArr = ['FE00439','FE00679','FE00478','FE00462'];     //Default checkbox selected value
    private cPricingTypeArr = ['LP'];                                //Default checkbox selected value
    private cMetricArr = ['LPA'];                                    //Default checkbox selected value
    private cAssetArr = ['BT100AND199'];                             //Default checkbox selected value
    // private segmentArr = ['Commercial'];                            //Default checkbox selected value

    // private selectedState = 'NY';
    // private selectedBusinessSegment = 'Commercial';

    constructor(private http: HttpClient, private authservice: AuthService) { }

    getMainTable(postData: any) {
        let methodUrl = this.apiUrl + 'main/data';

        // let httpOptions = new HttpHeaders()
        //     .set('Authorization', 'Bearer ' + localStorage.getItem('token'))

        return this.http
            // .post(methodUrl, postData, { headers: httpOptions })
            .post(methodUrl, postData)
            .catch(this.handleError);
    }

    getMainTableCustomColumnNamesData(postData: any) {
        let methodUrl = this.apiUrl + 'main/columns';

        postData = {
            "bankname": "",
            "states": this.selectedState
        }

        return this.http
            .post(methodUrl, postData)
            .catch(this.handleError);
    }

    getProductcomparison(postData: any) {
        let methodUrl = this.apiUrl + 'main/productcomparison';

        return this.http
            .post(methodUrl, postData)
            .catch(this.handleError);
    }

    getProductFeeTree() {
        let methodUrl = this.apiUrl + 'producttree';

        return this.http
            .get(methodUrl)
            .catch(this.handleError);
    }

    getStates() {
        let methodUrl = '../assets/json/states.json';

        return this.http
            .get(methodUrl).map(response => <State[]>response['results'])
            .catch(this.handleError);
    }

    getBusinessSegments() {
        let methodUrl = '../assets/json/businesssegments.json';

        return this.http
            .get(methodUrl).map(response => <BusinessSegment[]>response['results'])
            .catch(this.handleError);
    }

    private handleError(error: any) {
        // let errMsg = (error.message) ? error.message : error.status ? '${error.status} - ${error.statusText}' : 'Server error';
        return Observable.throw(error);
    }

    public setFeeArr(val) {
        this.feeArr = val;
    }

    public getFeeArr() {
        return this.feeArr;
    }

    public setMPricingTypeArr(val) {
        this.mPricingTypeArr = val;
    }

    public getMPricingTypeArr() {
        return this.mPricingTypeArr;
    }

    public setMMetricArr(val) {
        this.mMetricArr = val;
    }

    public getMMetricArr() {
        return this.mMetricArr;
    }

    public setMAssetArr(val) {
        this.mAssetArr = val;
    }

    public getMAssetArr() {
        return this.mAssetArr;
    }

    public setCPricingTypeArr(val) {
        this.cPricingTypeArr = val;
    }

    public getCPricingTypeArr() {
        return this.cPricingTypeArr;
    }

    public setCMetricArr(val) {
        this.cMetricArr = val;
    }

    public getCMetricArr() {
        return this.cMetricArr;
    }

    public setCAssetArr(val) {
        this.cAssetArr = val;
    }

    public getCAssetArr() {
        return this.cAssetArr;
    }

    public setSegmentArr(val) {
        this.segmentArr = val;
    }

    public getSegmentArr() {
        return this.segmentArr;
    }

    public setSelectedState(val) {
        this.selectedState = val;
    }

    public getSelectedState() {
        return this.selectedState;
    }

    public setSelectedBusinessSegment(val) {
        this.selectedBusinessSegment = val;
    }

    public getSelectedBusinessSegment() {
        return this.selectedBusinessSegment;
    }

    public getTopBillingFee() {
        return this.TopBillingFee;
    }
}

export class State {
    id: string;
    text: string
}

export class BusinessSegment {
    id: string;
    text: string
}
