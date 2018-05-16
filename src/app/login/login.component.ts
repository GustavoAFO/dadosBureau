import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterModule, Routes, Router, Route } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: ''
  };
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  loginWithEmail() {
    this.auth.signInRegular(this.user.email, this.user.password).then((res) => {
      // console.log(res);

      this.router.navigate(['home']);
    })
      .catch((err) => console.log('error: ' + err));
  }

}
