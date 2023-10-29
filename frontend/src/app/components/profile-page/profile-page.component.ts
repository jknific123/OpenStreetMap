import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from '../../services/session.storage.service';
import { UserService } from "../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../classes/user";
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  form!: FormGroup;
  isEditable = false;
  currentUser!: User;

  constructor(private sessionStorageService: SessionStorageService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this.sessionStorageService.getUser();
    this.form = this.formBuilder.group({
      // name: [{ value: this.currentUser.name, disabled: true }, [Validators.required]],
      // email: [{ value: this.currentUser.email, disabled: true }, [Validators.required, Validators.email]],
      password: [{ value: '', disabled: true } , [Validators.required]],
      password2: [{ value: '', disabled: true}, [Validators.required]],
      // role: [{ value: this.currentUser.role, disabled: true }, [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  onClickChangePassword() {
    this.isEditable = true;
    this.enableInputFields();
  }

  onClickCancelEdit() {
    this.isEditable = false;
    this.form.reset();
    this.disableInputFields();
  }

  submitUpdateUserData(): void {

    if (this.form.invalid) {
      // Touch all fields to trigger the error messages
      this.form.markAllAsTouched();
      return;
    }

    this.isEditable = false;
    this.disableInputFields();
    this.userService.updateUserDataById(this.currentUser._id, this.form.getRawValue()).subscribe({
      next: data => {
        this.sessionStorageService.saveUser(data);
        this.currentUser = data;
        this.form.reset();
        this.toastr.success('User update was successful!');
      },
      error: err => {
        // console.log('Posodabljanje uporabnika ni bilo uspešno: ', err);
        console.log('User update failed: ', err);
      }
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls['password'].value;
    const confirmPass = group.controls['password2'].value;
    return pass === confirmPass ? null : { notSame: true };
  }

  disableInputFields() {
    // this.form.controls['name'].disable();
    // this.form.controls['email'].disable();
    this.form.controls['password'].disable();
    this.form.controls['password2'].disable();
    // this.form.controls['role'].disable();
  }

  enableInputFields() {
    // this.form.controls['name'].enable();
    // this.form.controls['email'].enable();
    this.form.controls['password'].enable();
    this.form.controls['password2'].enable();
    // this.form.controls['role'].enable();
  }
}
