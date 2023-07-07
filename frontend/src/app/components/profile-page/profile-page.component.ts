import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../services/session.storage.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  form!: FormGroup;
  isEditable = false;
  currentUser: any;

  constructor(private sessionStorageService: SessionStorageService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.currentUser = this.sessionStorageService.getUser();
    console.log(this.currentUser)
    this.form = this.formBuilder.group({
      name: [{ value: this.currentUser.name, disabled: true }, [Validators.required]],
      email: [{ value: this.currentUser.email, disabled: true }, [Validators.required]],
      password: [{ value: '', disabled: true }],
      role: [{ value: this.currentUser.role, disabled: true }, [Validators.required]]
    });
  }

  onClickEdit() {
    this.isEditable = true;
    this.enableInputFields();
  }

  submitUpdateUserData(): void {
    this.isEditable = false;
    // TODO spisi update user data
  }

  disableInputFields() {
    this.form.controls['name'].disable();
    this.form.controls['email'].disable();
    this.form.controls['password'].disable();
    this.form.controls['role'].disable();
  }

  enableInputFields() {
    // TODO zaenkrat se da posodobit samo ime
    this.form.controls['name'].enable();
    // this.form.controls['email'].enable();
    // this.form.controls['password'].enable();
    // this.form.controls['role'].enable();
  }
}
