import { Component } from '@angular/core';
import { FirebaseConfig } from './../environments/firebase.config';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

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
  txtInfo = '';
  basePath = '/uploads';
  txtTitulo = '';
  txtLink = '';
  aDeletar: { id: null };

  selectedFiles: FileList;
  progress: { percentage: number } = { percentage: 0 }

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
      // console.log(teste);
    });


  }



  deletarItem() {
    const itemsRef = this.db.list(this.breadcrumb + '/' + this.aDeletar.id);
    itemsRef.remove();
    // this.aDeletar = null;
  }

  selecionar(item) {
    console.log(this.breadcrumb + '/' + item.id);
    this.aDeletar = item;
  }

  // ------------------------


  selectFile(event) {
    this.progress.percentage = 0;
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
  }

  pushFileToStorage(fileUpload: File, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.name}`).put(fileUpload);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (error) => {
        // fail
        console.log(error)
      },
      () => {
        // console.log('está aqui');
        // fileUpload.url = uploadTask.snapshot.downloadURL
        // fileUpload.name = fileUpload.file.name
        this.saveFileData(fileUpload, uploadTask.snapshot.downloadURL);
      }
    );
  }

  upload() {
    const file = this.selectedFiles.item(0)
    this.pushFileToStorage(file, this.progress);
  }

  private saveFileData(fileUpload: File, url) {
    console.log('colocando no banco');
    this.db.list('/' + this.atual).push({
      url: url,
      nome: fileUpload.name,
      tipo: fileUpload.type
    });
  }


  // ---------------------

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

  addInfoText() {
    this.db.list('/' + this.atual).push({
      tipo: 'Texto',
      valor: this.txtInfo
    })
  }

  addInfoVideo() {
    const embed = this.txtLink.split('v=');
    console.log(embed);
    const embedado = 'https://www.youtube.com/embed/' + embed[1];
    console.log(embedado);

    this.db.list('/' + this.atual).push({
      tipo: 'Video',
      titulo: this.txtTitulo,
      link: this.txtLink,
      embed: embedado
    })
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
