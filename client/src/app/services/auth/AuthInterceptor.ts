import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector,
                private snackBar: MatSnackBar) {
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('AuthInterceptor');
        const clonedRequest =
            request.clone(
                {withCredentials: true}
            );

        return next.handle(clonedRequest)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let message = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        message = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        message = `HTTP status code: ${error.status}`;
                    }
                    this.snackBar.open(message, 'Server Error', {
                        duration: 5000
                    });
                    return throwError(error.error);
                })
            )
    }
}
