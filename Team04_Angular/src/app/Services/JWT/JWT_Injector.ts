import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
//Used to inject the token into the header of the api call
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Check if the request already has an Authorization header
        if (!req.headers.has('Authorization')) {
            const token = sessionStorage.getItem('jwtToken');

            if (token) {
                // Clone the request and add the Authorization header
                req = req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                });
            } else {
                console.log('No token found in sessionStorage');
            }
        } else {
            console.log('Request already has an Authorization header');
        }

        return next.handle(req);
    }
}