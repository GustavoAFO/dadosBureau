import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

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
  constructor(private auth: AuthService) { }

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
      this.auth.createUserEmailPassword(this.cadastroForm.get('email').value,
        this.cadastroForm.get('senha').value, this.cadastroForm.get('tipo').value).then(teste => {
          console.log(teste);
          this.error = teste;
        });
    }
    /* console.log('email: ' + this.email + ' senha: ' + this.senha + ' tipo: ' + this.tipo);
    this.auth.createUserEmailPassword(this.email, this.senha, this.tipo).then(teste => {
       console.log(teste);
    }); */
  }
}
