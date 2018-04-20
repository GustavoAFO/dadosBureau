import { Component } from '@angular/core';
import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  items: Observable<any[]>;
  atual = 'base';
  nivel = 0;
  breadcrumb = 'base';
  breadcrumbVisible: any[] = [];
  txtDado = '';
  chcFinal = false;

  coursesObservable: AngularFireList<any[]>;

  constructor(private db: AngularFireDatabase) {

    // this.coursesObservable = this.getCourses('/courses');


    // this.coursesObservable = this.getCoursesTeste();
    // console.log(this.coursesObservable);

    this.breadcrumbVisible.push({
      'nome': 'base',
      'key': 'base'
    });

    this.items = this.getCourses();


    this.items.forEach(teste => {
      console.log(teste);
    });


  }

  /*
  getCourses(listPath): AngularFireList<any[]> {

    // this.db.database.ref('/courses').once('value').then();

    return this.db.list(listPath);

  }*/

  /*
  getCoursesTeste(): AngularFireList<any[]> {
    return this.db.list('/courses');
  }
  */

  getCourses(): Observable<any[]> {
    return this.db.list('/' + this.atual).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.val();
        const id = a.payload.key;
        return { id, ...data };
      });
    });
  }

  addCourse() {
    this.db.list('/' + this.atual).push({
      dado: this.txtDado,
      final: this.chcFinal
    });
  }

  afundar(item) {
    this.txtDado = '';

    this.breadcrumb = this.breadcrumb + '/' + item.id;
    // this.breadcrumbVisible = this.breadcrumbVisible + '/' + item.dado;

    this.breadcrumbVisible.push({
      'nome': item.dado,
      'key': item.id
    });

    console.log(item);
    this.nivel++;
    this.atual = this.breadcrumb;
    this.items = this.getCourses();

  }

  abrir(item) {
    this.breadcrumb = '';

    this.breadcrumbVisible.forEach(teste => {
      if (this.breadcrumbVisible.indexOf(teste) <= this.breadcrumbVisible.indexOf(item)) {
        // console.log(teste.nome + ' index: ' + this.breadcrumbVisible.indexOf(teste));
        this.breadcrumb = this.breadcrumb + '/' + teste.key;

      } else {
        this.breadcrumbVisible.splice(this.breadcrumbVisible.indexOf(teste));
      }

    });

    // console.log(this.breadcrumbVisible.length);
    this.nivel = this.breadcrumbVisible.length;
    this.nivel--;
    this.atual = this.breadcrumb;
    this.items = this.getCourses();
  }
}
