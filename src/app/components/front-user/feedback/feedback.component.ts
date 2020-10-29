import { UserService } from './../../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  rating: any = environment.rating;
  // message: any;
  modalData: any;
  feedback: any;
  isThankyou: boolean = false;

  constructor(
    private modalService: NgxSmartModalService,
    private userService: UserService,
    private router: Router,
    config: NgbRatingConfig
  ) {
    config.max = environment.rating;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.modalService.getModal('feedbackModal').onOpen.subscribe((modal: any) => {
      console.log('---modal get data-0-----', modal.getData())
      this.modalData = modal.getData();
    })
    this.modalService.getModal('feedbackModal').onClose.subscribe((modal: any) => {
      this.modalService.resetModalData('feedbackModal');
    })
    this.modalService.getModal('thankyouModal').onOpen.subscribe((modal: any) => {
      // console.log('---modal get data-0-----', modal.getData())
      // this.modalData = modal.getData();
    })
  }

  submit = () => {
    console.log('===this.rating', this.rating);
    // this.router.navigate(['/']);
    this.modalService.close('feedbackModal');

    let feedbackData = {
      name: this.modalData.frontUserName,
      adminId: this.modalData.adminUserId,
      // message: this.message,
      feedback: this.rating,
      // rating: this.rating
    }
    this.userService.addFeedback(feedbackData).subscribe(data => {
      console.log('Feedback Response :: ', data);
      this.modalService.open('thankyouModal')
    }, error => {
      console.log('Error :: ', error);
      this.router.navigate(['/']);
    });;

  }

  goToHome = () => {
    this.modalService.close('thankyouModal');
  }

}
