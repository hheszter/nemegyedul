import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  @Input() modalTitle: string;
  @Input() modalText: string;
  @Input() formNeeded: boolean;

  @Output() closing = new EventEmitter();

  emailForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[\w\.]+@\w+\.[a-z\.]{2,5}$/)])
    })
  }

  close() {
    let value = this.formNeeded ? this.emailForm.value : null;
    this.closing.emit(value);
  }

}
