import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService, SignalService, AlertService } from '../app/_services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jitsi';
  returnUrl: string;
  isValidForLogout: boolean = true;
  adminId: any;
  isValidForNav: boolean = true;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private signalService: SignalService,
    private alertService: AlertService
  ) { }

  async logout() {
    let userInfo = await this.authenticationService.getLocalUser();
    // console.log('User Info :: ', userInfo.email);
    this.adminId = await localStorage.getItem('new_admin');
    // console.log('Admin Id :: ', this.adminId);
    this.signalService.send('logout_admin_user', this.adminId);

    this.authenticationService.logout();
    this.alertService.success('Logout Success!!');
    this.router.navigate(['/admin/login']);
  }

  ngOnInit() {
    this.signalService.connect();
    if (!localStorage.getItem('access_token') && this.router.url != '/') {
      this.router.navigate(['/admin/login']);
    }
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd)
    )
      .subscribe((event: any) => {
        let currentRoute = this.route.root;
        while (currentRoute.children[0] !== undefined) {
          currentRoute = currentRoute.children[0];
        }
        const stateName = currentRoute.snapshot.routeConfig.path;
        this.isValidForLogout = (stateName !== 'login' && stateName !== '') ? true : false;
        this.isValidForNav = (stateName !== 'login' && stateName !== '') ? true : false;
      });
  }

}
