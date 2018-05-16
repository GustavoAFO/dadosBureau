import { Injectable } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';


import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  // private userDatabaseCheck: Observable<any[]>;
  // private userDatabaseCheckDetails: any[] = null;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router, private db: AngularFireDatabase) {

    /*
    this.db.list('/users/UrYMKpPRdDh6rL7zTk0hB0A1Aln1').push({
      email: 'gustavoafonso.gu@gmail.com',
      type: 'adm'
    });*/

    this.user = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
          this.checkUser();
        } else {
          this.userDetails = null;
        }
      }
    );


  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  signInRegular(email, password) {

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((res => {
      // this.checkUser();
      this.router.navigate(['home']);
    }));

  }

  checkUser() {

    const myRef = this.db.list('users/' + this.userDetails.uid).valueChanges();

    myRef.subscribe((busca) => {
      if (busca.length > 0) {
        // console.log(busca);
        // console.log('Ok');
        // this.router.navigate(['home']);
        console.log(busca[0]['type']);
        localStorage.setItem('user_type', busca[0]['type']);

        // console.log(this.router.url);
        if (this.router.url === '/login') {
          this.router.navigate(['home']);
        }
      } else {
        // console.log('Nao ok');
        this.logout();
      }
    });

    // console.log(myRef);
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }


  createUserEmailPassword(email, password, type) {
    this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then((res => {

      console.log(res);

      this.db.list('/users/' + res.uid).push({
        email: email,
        type: type
      }).then((resp) => {
        // this.router.navigate(['home']);
      });

    })).catch((err) => console.log('error: ' + err));
  }

}




