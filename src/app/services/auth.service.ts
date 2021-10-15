import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Router } from "@angular/router";

// import {  Headers } from '@angular/http';
@Injectable()
export class AuthService {
  // private baseUrl = 'http://localhost/api/'
  // private baseUrl = 'http://127.0.0.1:5000/';
  private baseUrl = 'http://trex.informars.com/api/'
  TOKEN_KEY = 'token'

  constructor(private http: HttpClient, private router: Router) { }

  get token() {
    // console.log('gettoken: ', localStorage.getItem(this.TOKEN_KEY))
    return localStorage.getItem(this.TOKEN_KEY)
  }

  loginUser(email: string, password: string) {

    let url = this.baseUrl + 'login'
    let body = {}
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(email + ':' + password) });
    // let headers: Headers = new Headers({'Content-Type': 'application/json', 'Authorization' : 'Basic ' + btoa(email + ':' + password)});

    return this.http.post<any>(url, body, { headers: headers })
      .subscribe(res => {
        // console.log(res)
        localStorage.setItem(this.TOKEN_KEY, res.token)
        this.router.navigate(['dashboard']);
      })
  }
}











// import { HttpClientModule } from '@angular/common/http';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// // import { HttpClientModule } from '@angular/http'
// import { Injectable } from '@angular/core'

// @Injectable()
// export class AuthService {
//     private baseUrl = 'http://127.0.0.1:5000/';

//     constructor(private http: HttpClient) {}


//     loginUser(loginData) {
//         let url = this.baseUrl + 'login';
//         console.log('AUTH-LINE-15', loginData)
//         this.http.post(url,{}, loginData).subscribe(res => {
//             console.log('in loginuser');
//             // console.log(res);
//             // localStorage.setItem('token', res.json().token)
//         })
//     }

// }



// import { IUser } from './user';
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, Operator } from 'rxjs';
// //import { Observable } from 'rxjs/Rx';
// // import 'rxjs/add/operator/map';
// // import 'rxjs/add/operator/catch';
// // import 'rxjs/add/operator/do';
// // import 'rxjs/add/operator/shareReplay';

// import * as moment from "moment";


// @Injectable()
// export class AuthService {
//     private _baseUrl = 'http://127.0.0.1:5000/';
//     private user: IUser;

//     //private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'text/html'});

//     constructor(private http: HttpClient) {}

//     login(email:string, password:string ) {
//         let url = this._baseUrl + 'login';
//         let body = {}
//         let headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json', 
//                                                     'Authorization' : 'Basic ' + btoa(email + ':' + password)});
//         console.log(headers)
//         // return this.http.post(url, body, {headers: headers})
//         //     .do(res => this.setSession(res))
//         //     .shareReplay()
//         return this.http.post(url, body, {headers: headers})
//         // .subscribe(res => {
//         //     console.log(res)
//         // })
//         //     // .map(response => response.json())
//             // .catch(this.handleError);
//     }

//     private setSession(authResult) {
//         // console.log(authResult)
//         const expiresAt = moment().add(authResult.expiresIn,'minute');
//         console.log('Line-40:', expiresAt);

//         localStorage.setItem('id_token', authResult.idToken);
//         localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
//     }          

//     logout() {
//         localStorage.removeItem("id_token");
//         localStorage.removeItem("expires_at");
//     }

//     public isLoggedIn() {
//         return moment().isBefore(this.getExpiration());
//     }

//     isLoggedOut() {
//         return !this.isLoggedIn();
//     }

//     getExpiration() {
//         const expiration = localStorage.getItem("expires_at");
//         const expiresAt = JSON.parse(expiration);
//         return moment(expiresAt);
//     }    
// }