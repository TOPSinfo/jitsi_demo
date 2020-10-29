import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { BindingFlags } from '@angular/compiler/src/core';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/login`, { email, password }).pipe(map(resp => {
            // console.log('User resp :: ', resp)
            let userInfo = resp.data;
            if (userInfo) {
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
                localStorage.setItem('access_token', userInfo.token);
                this.currentUserSubject.next(userInfo);
            }
            // console.log('User return...', userInfo.token)
            return userInfo;
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        this.currentUserSubject.next(null);
        return;
    }

    isSuperAdmin() {
        let userInfo: any;
        let flag = false;
        let currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            userInfo = JSON.parse(currentUser);
        }
        if (userInfo && userInfo.userRole && userInfo.userRole.toLowerCase() == 'superadmin') {
            flag = true;
        }
        // console.log('Flag :: ', flag)
        return flag;
    }

    getLocalUser() {
        let userInfo: any;
        let currentUser = localStorage.getItem('currentUser');
        // console.log('currentUser :: ', currentUser)
        if (currentUser) {
            userInfo = JSON.parse(currentUser);
        }
        // console.log('userInfo :: ', userInfo);
        return userInfo;
    }
}