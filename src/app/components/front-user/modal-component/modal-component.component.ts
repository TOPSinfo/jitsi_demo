import { SignalService } from './../../../_services/socket.service';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

declare var $;

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponentComponent implements OnInit {
  userInfoForm: FormGroup;
  random: any;
  connectId: any;
  meetUrl: any;
  message: string = '';
  submitForm: boolean = false;
  isGetResponse: boolean = false;
  adminUserName: string = '';
  isCallRejected = false;
  isOnHold = false;

  @ViewChild('iframe', { static: false }) iframe: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private signalService: SignalService,
    private modalService: NgxSmartModalService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.creatForm()
  }

  ngOnInit(): void { }

  private creatForm(): void {
    this.userInfoForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      subject: ['', Validators.required],
    });
  }

  get form() { return this.userInfoForm.controls; }

  submit = () => {
    this.submitForm = true;
    console.log('getSocket :: ', this.signalService.socketId, this.signalService.getSocket());
    console.log('-------this.form.error', this.userInfoForm)
    if (this.userInfoForm.valid) {
      this.submitForm = false;
      this.modalService.close('userInfoModal');
      this.modalService.open('callConnectingModal');

      this.connectId = new Date().getTime();
      console.log('FrontId--->>', this.connectId);

      let req_connect_data = {
        connectId: this.connectId,
        ...this.userInfoForm.value
      }

      this.userInfoForm.reset();

      this.signalService.send('req_to_connect', req_connect_data);

      this.signalService.listen('front_return_link', data => {
        console.log('front_return_link :: ', data);
        this.isGetResponse = true;
        this.adminUserName = data.adminName;
        if (data.url) {
          setTimeout(() => {
            this.modalService.close('callConnectingModal');
            this.modalService.open('callConnectedModal');
            this.meetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
          }, 3000);
        } else if (data.OnHold) {
          this.isOnHold = true;
          setTimeout(() => {
            this.modalService.close('callConnectingModal');
            this.modalService.open('callOnHoldModal');
            setTimeout(() => {
              this.modalService.close('callOnHoldModal');
            }, 5000);
          }, 3000);
        } else {
          this.message = data.msg;
          // if removes this settimeout, the info modal gets open, upon callConnectingModal
          setTimeout(() => {
            this.modalService.close('callConnectingModal');
            this.modalService.open('infoModal');
          }, 1000)
          // this.router.navigate(['/']);
        }

      });

      this.signalService.listen('all_admin_reject_request', data => {
        this.isCallRejected = true;
        console.log('Reject......!!!')
        this.modalService.close('callConnectingModal');

        this.message = data.msg;
        this.modalService.open('infoModal');
      });

      setTimeout(() => {
        if (!this.isGetResponse) {
          console.log('Modal Close automatic...')
          this.modalService.close('callConnectingModal');
          this.modalService.close('infoModal');
          this.message = 'Please Call After some time.';
          if (!this.isCallRejected && !this.isOnHold) {
            // this.signalService.send('close_admin_notify_request',)
            this.modalService.open('infoModal');
            setTimeout(() => {
              this.modalService.close('infoModal');
              this.isCallRejected = false;
            }, 10000);
          }
        }
      }, 30000);
    }

    // All frontend modal closed for disconnect fontend user
    this.signalService.listen('disconnect_user', data => {
      console.log('Data :: ', data);
      this.router.navigate(['/']);
      this.modalService.closeAll();
      this.modalService.setModalData({ ...data }, 'feedbackModal');
      this.modalService.open('feedbackModal');
    })
  }

}
