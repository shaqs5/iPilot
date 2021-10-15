import { Observable } from 'rxjs/Rx';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = localStorage.getItem('token');

        console.log('interceptor: ', req);

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'token ' + token)
            });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}


// import { Injectable, Injector } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
// import { AuthService } from './auth.service';

// @Injectable()
// export class AuthInterceptorService implements HttpInterceptor {

//   constructor(private injector : Injector ) { }

//   intercept(req: HttpRequest<any> , next: HttpHandler){
//      console.log(req)
//     //  return next.handle(req)
//     var auth = this.injector.get(AuthService)
//     var authRequest = req.clone({
//       headers: req.headers.set('Authorization', 'token ' + auth.token)
//     })
//     return next.handle(authRequest)
//   }

// }
