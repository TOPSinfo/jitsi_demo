import { Component, OnInit } from '@angular/core';
import { first, flatMap } from 'rxjs/operators';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { UserService, AuthenticationService, AlertService } from '../../_services';
import { environment } from '../../../environments/environment';
import { User } from '../../_models';



@Component({
    selector: 'app-call-history',
    templateUrl: './call-history.component.html',
    styleUrls: ['./call-history.component.css']
})

export class CallHistoryComponent implements OnInit {
    loading = false;
    showUsersTag = false;
    users: User[] = [];
    calls: any = [];
    callResp: any = {};
    userInfo: any;
    callObj: any;
    avgRating: any = 0;
    // totalRating: any = 0;
    gotRating: any = 0;
    rating: any = 0;
    reviews: any = 0;
    constructor(
        private userService: UserService,
        private authenticateService: AuthenticationService,
        config: NgbRatingConfig,
        private alertservice: AlertService
    ) {
        config.max = environment.rating;
    }


    ngOnInit() {
        this.loading = true;

        // if (currentUser) {
        //     this.userInfo = JSON.parse(currentUser);
        // }
        // if (this.userInfo && this.userInfo.userRole && this.userInfo.userRole.toLowerCase() == 'superadmin') {
        if (this.authenticateService.isSuperAdmin()) {
            this.showUsersTag = true;
        }
        // }

        let currentUser = localStorage.getItem('currentUser');
        this.userInfo = JSON.parse(currentUser);
        console.log('User Info :: ', this.userInfo)

        this.userService.getCallHistory(this.userInfo.userId).pipe(first()).subscribe(callResp => {
            console.log('Call History :: ', callResp);
            if (!callResp.error) {
                this.calls = callResp.data;

                this.userService.getRating(this.userInfo.userId).pipe(first()).subscribe(rating => {
                    console.log('Rating :: ', rating)
                    if (rating && rating.data && rating.data.length) {
                        for (let i = 0; i < rating.data.length; i++) {
                            this.gotRating += parseInt(rating.data[i].feedback);
                            // this.totalRating += parseInt(rating.data[i].rating);
                        }
                        console.log('Got Rating :: ', this.gotRating);
                        // console.log('Tota Rating :: ', this.totalRating);
                        this.rating = environment.rating;
                        this.reviews = rating.data.length;
                        this.avgRating = ((this.gotRating * this.rating) / (rating.data.length * this.rating)).toFixed(1);
                        console.log('Avg Rating :: ', this.avgRating);
                    }

                    this.loading = false;
                });
            } else {
                // this.calls = [];
                this.loading = false;
            }
        }, error => {
            this.alertservice.error(error);
        });
    }
}