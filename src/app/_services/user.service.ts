import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class UserService {
    private editUserSource = new BehaviorSubject({});
    editUserDetail = this.editUserSource.asObservable();

    constructor(private http: HttpClient) { }

    setEditUserDetail(user: object) {
        this.editUserSource.next(user)
    }

    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/users`);
    }

    create(user: User) {
        return this.http.post(`${environment.apiUrl}/users`, user);
    }

    getCallHistory(userId: User) {
        return this.http.get<any>(`${environment.apiUrl}/users/calls?adminId=${userId}`);
    }

    // getById(id: string) {
    //     return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    // }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users`, params)
            .pipe(x => {
                console.log('---updatew res in service', x);
                // update stored user if the logged in user updated their own record
                let userValue = JSON.parse(localStorage.getItem('currentUser'));
                if (id == userValue['id']) {
                    // update local storage
                    const user = { ...userValue, ...params };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return x;
            });
    }

    delete(user) {
        return this.http.delete(`${environment.apiUrl}/users/${user}`);
    }

    addFeedback(feedbackData) {
        return this.http.post(`${environment.apiUrl}/users/feedback`, feedbackData);
    }

    getRating(adminId) {
        return this.http.get<any>(`${environment.apiUrl}/users/rating?adminId=${adminId}`);
    }

    saveCallDetails(callData) {
        return this.http.post(`${environment.apiUrl}/users/calls`, callData);
    }
}