import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService, UserService, AuthenticationService } from '../../_services/index';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit {
  form: FormGroup;
  returnUrl: string;
  loading = false;
  submitted = false;
  model: any = {};
  roleData: Array<Object> = [
    { id: 0, name: "SuperAdmin" },
    { id: 1, name: "Admin" }
  ];
  selectedLevel: any;
  editData: object = {};
  title: string = 'Add User';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  public selected() {
    // console.log('--->>', this.selectedLevel)
  }

  ngOnInit() {

    this.userService.editUserDetail.subscribe(data => {
      if (Object.keys(data).length) {
        this.editData = data;
        this.form.patchValue({
          ...this.editData
        })
        this.title = 'Edit User';
        
        this.selectedLevel = this.roleData.filter(role => role['name'] === data['user_role'])[0]
      }
    })
    if (this.router.url === '/admin/edit-user' && Object.keys(this.editData).length === 0) {
      this.router.navigate(['/admin/user-list'])
    }

    if (!this.authenticationService.isSuperAdmin()) {
      return this.router.navigate(['/admin/dashboard']);
    }

  }

  createForm = () => {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    // console.log('---->>', this.form.value);
    this.form.value['role'] = this.selectedLevel.name;

    if (Object.keys(this.editData).length) {
      this.userService.update(this.editData['id'], this.form.value).subscribe(() => {
        this.alertService.success('Updated successfully');
        // this.router.navigate(['/admin/user-list']);
        this.cancel();
      }, error => {
        this.alertService.error(error);
        this.loading = false;
      })
    } else {
      this.userService.create(this.form.value).subscribe(data => {
        this.alertService.success('Registration successful');
        this.router.navigate(['/admin/user-list']);
      }, error => {
        this.alertService.error(error);
        this.loading = false;
      });
    }
  }

  cancel = () => {
    this.title = 'Add User';
    this.editData = {};
    this.userService.setEditUserDetail({})
    this.router.navigate(['/admin/user-list']);
  }
}
