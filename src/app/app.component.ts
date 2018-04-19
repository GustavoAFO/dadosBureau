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
  breadcum = 'base';
  breadcumVisible = 'base';
  txtDado = '';

  coursesObservable: AngularFireList<any[]>;

  constructor(private db: AngularFireDatabase) {

    // this.coursesObservable = this.getCourses('/courses');


    // this.coursesObservable = this.getCoursesTeste();
    // console.log(this.coursesObservable);


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
    this.db.list('/' + this.atual).push({ dado: this.txtDado });
  }

  afundar(item) {
    this.breadcum = this.breadcum + '/' + item.id;
    this.breadcumVisible = this.breadcumVisible + '/' + item.dado;
    console.log(item);
    this.nivel++;
    this.atual = this.breadcum;
    this.items = this.getCourses();

  }
}
