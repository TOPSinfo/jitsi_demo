import { Router } from '@angular/router';
import { AuthenticationService } from './../../_services/authentication.service';
import { SignalService } from './../../_services/socket.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private signalService: SignalService,
    private router: Router
  ) { }

  async logout() {
    // this.signalService.connect();
    let userInfo = await this.authenticationService.getLocalUser();
    // console.log('User Info :: ', userInfo.email);
    this.signalService.send('admin-disconnect', userInfo.email);

    this.authenticationService.logout();
    this.router.navigate(['/admin/login']);
  }

  ngOnInit(): void {
  }

}
