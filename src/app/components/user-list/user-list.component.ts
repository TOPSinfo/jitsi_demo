import { AlertService } from './../../_services/alert.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '../../_services';
import { User } from '../../_models';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
    loading = false;
    users: any = [];
    calls: any = [];
    callResp: any = {};
    userInfo: any;
    rating: number = environment.rating;
    deleteUserData: any;

    constructor(
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private modalService: NgxSmartModalService,
        private alertService: AlertService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loading = true;
        if (!this.authenticationService.isSuperAdmin()) {
            return this.router.navigate(['/admin/dashboard']);
        }

        this.userService.getAll().pipe(first()).subscribe(resp => {
            this.users = resp.data;

            if (this.users.length) {
                for (let x = 0; x < this.users.length; x++) {
                    this.users[x]['avgRating'] = 0;
                    this.users[x]['rating'] = 0;

                    let feedback = this.users[x].user_feedbacks;
                    if (feedback.length) {
                        for (let i = 0; i < feedback.length; i++) {
                            this.users[x]['rating'] += parseInt(feedback[i].feedback);
                        }
                        this.users[x]['avgRating'] = (this.users[x]['rating'] / (feedback.length)).toFixed(1);
                    }
                }
            }

            this.loading = false;
        }, error => {
            this.alertService.error(error);
        });

    }

    editUser = (user) => {
        this.userService.setEditUserDetail(user);
        this.router.navigate(['/admin/edit-user']);
    }

    deleteUser = (user) => {
        this.deleteUserData = user
        this.modalService.open('confirmModal');
        // this.userService.delete(user.id).subscribe(resp => {
        //     console.log('-------------delete res', resp)
        //     this.users = this.users.filter(data => data.id !== user.id)
        // })
    }

    cancel = () => {
        this.modalService.close('confirmModal');
    }

    delete = () => {
        this.userService.delete(this.deleteUserData.id).subscribe(resp => {
            this.modalService.close('confirmModal');
            this.alertService.success('User deleted successfully');
            this.users = this.users.filter(data => data.id !== this.deleteUserData.id)
        })
    }
}