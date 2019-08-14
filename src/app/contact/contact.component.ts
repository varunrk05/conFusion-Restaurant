import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

import { FeedbackService } from '../services/feedback.service';

import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  //flag: boolean;
  errMess: string;
  feedbackForm: FormGroup;
  feedback: Feedback;
  receivedFeedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective; //feedbackFormDirective is used to acces the template of the form which can be later used to reset the form

  constructor(private fb: FormBuilder,
    @Inject('BaseURL') private baseURL,
    private feedbackService: FeedbackService) { 
    this.createForm();
  }

  ngOnInit() {
  }

  formErrors = {  //If error is detected, then string containing the error will be added to this object
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  createForm(){
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: [0, [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''      
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.feedback=null;
    this.receivedFeedback=null;
    // console.log(this.feedback);
    // console.log(this.receivedFeedback);
    this.feedback = this.feedbackForm.value;
    document.getElementById('form-fin').style.display = "none"
    // console.log(this.feedback);
    this.feedbackService.submitFeedback(this.feedback)
      .subscribe(receivedfeedback => {
        this.receivedFeedback = receivedfeedback,
        // document.getElementById('form-fin').style.display = "none",
        setTimeout(function(){
          document.getElementById('form-fin').style.display = "block";
          document.getElementById('subm-fin').style.display = "none";
          this.receivedFeedback=null; 
          this.feedback = null;
          console.log("inside");
        }, 5000)
      },
      errmess => {
        this.errMess = <any>errmess;
      });
    console.log("reset");
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    console.log("resetform");
    this.feedbackFormDirective.resetForm();
  }

}
