import { UtilitiesService } from './utilities.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService extends BaseService {
    constructor(private http: HttpClient, private utilities: UtilitiesService) {
        super();
    }
    getAll() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`, httpOptions).pipe(catchError(this.handleError));
    }

    getMenuByUser(userId: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http
            .get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`, httpOptions)
            .pipe(map(res => {
                const functions = this.utilities.UnflatteringForLeftMenu(res);
                return functions;
            }), catchError(this.handleError));
    }
}
