import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterModule, Routes, Router, Route } from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm: FormGroup;
  error = null;

  /* user = {
    email: '',
    password: ''
  }; */

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
  }


  loginWithGoogle() {
    this.auth.signInWithGoogle();
  }



  loginWithEmail() {
    this.signInForm.controls['email'].markAsTouched();
    this.signInForm.controls['password'].markAsTouched();

    console.log(this.signInForm.get('email').value);

    if (this.signInForm.valid) {
      console.log('form valido');
      this.auth.signInRegular(this.signInForm.get('email').value, this.signInForm.get('password').value).then((res) => {
      })
        .catch((err) => {

          console.log('error: ' + err)
          this.error = err;
        });
    }

    /* this.auth.signInRegular(this.user.email, this.user.password).then((res) => {
      // console.log(res);

      // this.router.navigate(['home']);
    })
      .catch((err) => console.log('error: ' + err)); */
  }

}
