import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { SignalService } from '../../../_services';
import { NgxSmartModalService } from 'ngx-smart-modal';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    // returnUrl: string;
    random: any;
    connectFlag: any;

    constructor(
        private formBuilder: FormBuilder,
        private signalService: SignalService,
        private modalService: NgxSmartModalService,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({});
    }

    onSubmit() {
        // this.loading = true;
        this.submitted = true;
        this.modalService.open('userInfoModal');

    }
}