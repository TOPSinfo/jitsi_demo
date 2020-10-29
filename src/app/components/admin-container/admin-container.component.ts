import { SignalService } from './../../_services/socket.service';
import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.css']
})
export class AdminContainerComponent implements OnInit {
  currentUser: any = {}
  acceptObj: any;

  constructor(
    private modalService: NgxSmartModalService,
    private signalService: SignalService
  ) { }

  ngOnInit(): void {
    this.signalService.listen('send_admin_notification', response => {
      if (response.frontUserInfo && response.frontUserInfo.fullname) {
        this.modalService.setModalData({ ...response }, 'notifyAdminModal')
        this.modalService.open('notifyAdminModal')
        this.acceptObj = response;
      }
    });

    // On accept any one user request disconnect to all
    this.signalService.listen('acceptFlag', response => {
      this.modalService.close('notifyAdminModal');
      this.acceptObj = response;
    });

  }

}
