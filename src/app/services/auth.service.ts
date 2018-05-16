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

  private userDatabaseCheck: Observable<any[]>;
  private userDatabaseCheckDetails: any[] = null;

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

      if (this.userDatabaseCheckDetails == null) {
        console.log('NULO');
      } else {
        console.log('Nao nulo!');
      }
    }));

  }

  checkUser() {

    this.userDatabaseCheck = this.getUsers();

    /*
    this.userDatabaseCheck.forEach((teste) => {
      console.log(teste);
    });*/

    this.userDatabaseCheck.subscribe((usercheck) => {
      if (usercheck) {
        this.userDatabaseCheckDetails = usercheck;
        console.log('Aqui!');
        console.log(this.userDatabaseCheckDetails);
      } else {
        this.userDatabaseCheckDetails = null;
      }
    });

    // console.log(this.userDatabaseCheckDetails.length);
  }

  getUsers(): Observable<any[]> {
    return this.db.list('users/' + this.userDetails.uid).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
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

}




