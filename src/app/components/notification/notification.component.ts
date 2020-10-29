import { SignalService } from './../../_services/socket.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import '../../../assets/libs/external_api.js';
import { Router } from '@angular/router';
import { UserService, AlertService } from '../../_services';

declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationComponent implements OnInit {
  loadNotification: boolean = false;
  currentUser: any = {}
  link: any;
  acceptObj: any = {};
  domain: any;
  options: any;
  api: any;
  loadJitsi: any;
  rejectRespObj: any;
  infoObj: any = {};
  isGetResponse: boolean = false;
  callObj: any;
  frontUserName: string = '';
  startTime: any;
  endTime: any;
  duration: any;

  constructor(
    private signalService: SignalService,
    private modalService: NgxSmartModalService,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.modalService.getModal('notifyAdminModal').onOpen.subscribe((modal: any) => {
      this.acceptObj = modal.getData();
      this.infoObj = this.acceptObj;
      this.frontUserName = this.infoObj.frontUserInfo.fullname;
      console.log('Accept Obj ::========================>>>> ', this.acceptObj)
      setTimeout(() => {
        if (!this.isGetResponse) {
          this.modalService.close('notifyAdminModal');
          // alert('User is disconnected....!!!');
        }
      }, 30000);
    });
    this.modalService.getModal('notifyAdminModal').onClose.subscribe((modal: any) => {
      this.modalService.resetModalData('notifyAdminModal');
      this.acceptObj = {};
    });
  }

  accept = () => {
    // this.acceptObj = {};
    this.isGetResponse = true;
    console.log('======>> Accept  <<======');
    setTimeout(() => {
      this.startTime = new Date().getTime();
      console.log('Start time :: ', this.startTime)
    }, 8000);
    // this.loadJitsi = true;
    this.domain = 'meet.jit.si';
    this.modalService.open('jitsiMeet');
    this.options = {
      roomName: "jitsi-" + new Date().getTime(),
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#meet'),
      SHOW_WATERMARK_FOR_GUESTS: false,
      configOverwrite: { prejoinPageEnabled: false },
      userInfo: { displayName: JSON.parse(localStorage.getItem('currentUser')).username }
      // username: JSON.parse(localStorage.getItem('currentUser')).username,
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
    console.log('Api :: ', this.api._url);
    this.api.executeCommand('displayName', this.infoObj.frontUserInfo.fullname);
    // this.api.executeCommand('subject', this.acceptObj.frontUserInfo.subject);
    // this.api.executeCommand('toggleChat');
    // this.api.addListener('readyToClose', () => { console.log('Front call hung up fron add Listener Event'); });

    this.infoObj['link'] = this.api._url;
    this.infoObj['adminUserId'] = JSON.parse(localStorage.getItem('currentUser')).userId;
    this.infoObj['adminUserName'] = JSON.parse(localStorage.getItem('currentUser')).name;
    this.signalService.send('accept_connection', this.infoObj);
    this.api.addEventListener('participantLeft', (leftUser) => {
      console.log('>>>>>>>>>>>>>>>>> User Left------>>', leftUser);
      this.disconnectCall();
    });
    // participantLeft
    this.api.addEventListener('readyToClose', () => {
      console.log('>>>>>>>>>>>>>>>>>>>>> Close event triggere....!!');
      this.disconnectCall();
    });
  }


  reject = () => {
    console.log('======>> Reject <<======');
    this.isGetResponse = true;
    this.modalService.close('notifyAdminModal');
    // this.rejectRespObj = { connectId: this.infoObj.frontId };
    // this.signalService.send('req_to_connect', this.rejectRespObj);

    this.signalService.send('reject_call_request', this.infoObj);
  }

  dataDifference = (obj) => {
    var diff = obj.date2 - obj.date1;
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return mm + ':' + ss;
  }

  disconnectCall = () => {

    this.endTime = new Date().getTime();
    console.log('End Time :: ', this.endTime);
    this.signalService.send('disconnect_user_admin', this.infoObj);
    this.modalService.close('jitsiMeet');
    this.alertService.error('Call Disconnected..!!');
    document.getElementById('meet').innerHTML = "";
    let duration = this.dataDifference({ date1: this.startTime, date2: this.endTime })
    console.log('----->>', duration)
    this.callObj = {
      username: this.infoObj.frontUserInfo.fullname,
      subject: this.infoObj.frontUserInfo.subject,
      adminId: this.infoObj.adminUserId,
      duration: duration
    }
    console.log('Call Objec :: ', this.callObj)
    this.userService.saveCallDetails(this.callObj).subscribe(data => {
      console.log('CallDetails save Response :: ', data);

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/dashboard']);
      });
    }, error => {
      console.log('Error :: ', error)
    });
  }

}

