import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService, AlertService, SignalService } from '../../_services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  userId: any;
  accessToken: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private signalService: SignalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // localStorage.removeItem('currentUser');
    // localStorage.removeItem('access_token');
    // console.log('LocalStorage removed...')

    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    this.accessToken = localStorage.getItem('access_token');
    if (this.accessToken) {
      this.router.navigate(['/admin/dashboard']);
    } 
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    this.authenticationService.login(this.f.email.value, this.f.password.value).pipe(first()).subscribe(async resp => {
      this.loading = false;
      this.submitted = false;
      if (localStorage.getItem('access_token')) {
        // this.userId = new Date().getTime();
        this.userId = JSON.parse(localStorage.getItem('currentUser')).email;

        localStorage.setItem('new_admin', this.userId);
        this.signalService.send('new-admin-user', this.userId);
        this.router.navigate(['/admin/dashboard']);
        this.alertService.success('Login Success!!');
      } else {
        this.alertService.error('Login Failed!!');
      }
    });
  }
}