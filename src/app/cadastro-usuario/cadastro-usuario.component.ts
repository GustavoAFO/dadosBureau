import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireModule } from 'angularfire2';

import * as firebase from 'firebase';

import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFireDatabase } from 'angularfire2/database';

import { AngularFireAuthModule } from 'angularfire2/auth';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {
  cadastroForm: FormGroup;
  error = null;
  secondaryApp: any;
  constructor(private auth: AuthService, private db: AngularFireDatabase) {


    var FirebaseConfig = {
      apiKey: 'AIzaSyAuUTUrNt3mB56Jl9YQhrLfiK33CoVj33Y',
      authDomain: 'databasebureauuna.firebaseapp.com',
      databaseURL: 'https://databasebureauuna.firebaseio.com'
    };

    /* firebase.apps.forEach(app=>{
      console.log(app);
      //secondaryApp.auth().signOut();
    }) */

    var found = firebase.apps.find(x => x.name == "Second");
    if (found) {
      found.delete().then(res => {
        this.secondaryApp = firebase.initializeApp(FirebaseConfig, "Second");
      })

      console.log("APP LIMPO");
    } else {
      this.secondaryApp = firebase.initializeApp(FirebaseConfig, "Second");

    }


  }

  ngOnInit() {
    this.cadastroForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'senha': new FormControl(null, [Validators.required]),
      'tipo': new FormControl(null, [Validators.required])
    });
  }

  cadastrarUsuario() {
    this.cadastroForm.controls['email'].markAsTouched();
    this.cadastroForm.controls['senha'].markAsTouched();
    this.cadastroForm.controls['tipo'].markAsTouched();

    if (this.cadastroForm.valid) {
      console.log('valido');
      /* this.auth.createUserEmailPassword(this.cadastroForm.get('email').value,
        this.cadastroForm.get('senha').value, this.cadastroForm.get('tipo').value).then(teste => {
          console.log(teste);
          this.error = teste;
        }); */

      /* var FirebaseConfig = {
        apiKey: 'AIzaSyAuUTUrNt3mB56Jl9YQhrLfiK33CoVj33Y',
        authDomain: 'databasebureauuna.firebaseapp.com',
        databaseURL: 'https://databasebureauuna.firebaseio.com'
      };


      var secondaryApp = firebase.initializeApp(FirebaseConfig, "Second,CreateUser"); */

      //const auth = new AngularFireAuth(null, FirebaseConfig, null, null);

      var email = this.cadastroForm.get('email').value;
      var password = this.cadastroForm.get('senha').value;
      var tipo = this.cadastroForm.get('tipo').value;

      this.secondaryApp.auth().createUserWithEmailAndPassword(email, password).then(res => {
        console.log("RES");
        console.log(res);
        var uid;

        if (res.user.uid) {
          uid = res.user.uid
        }
        console.log("UID");
        console.log(uid);

        this.db.list('/users/' + uid + "/").push({
          email: email,
          type: tipo
        }).then((resp) => {
          // this.router.navigate(['home']);
        });

        //secondaryApp.auth().signOut();
      }).catch(error => {
        console.log("ERRO");
        console.log(error);
        this.error = error.message;
      });

      /* this.createUserEmailPassword(secondaryApp, this.cadastroForm.get('email').value,
        this.cadastroForm.get('senha').value, this.cadastroForm.get('tipo').value); */


    }
    /* console.log('email: ' + this.email + ' senha: ' + this.senha + ' tipo: ' + this.tipo);
    this.auth.createUserEmailPassword(this.email, this.senha, this.tipo).then(teste => {
       console.log(teste);
    }); */
  }



}
