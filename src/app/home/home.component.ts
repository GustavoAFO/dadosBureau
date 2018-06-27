import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AuthService } from '../services/auth.service';

import 'rxjs/add/operator/map';

// PIPE PARA O EMBED DOS VIDEOS
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
  aDeletar: { id: null, nome: null };
  txtProblema;

  selectedFiles: FileList;
  progress: { percentage: number } = { percentage: 0 }

  coursesObservable: AngularFireList<any[]>;

  constructor(private db: AngularFireDatabase, public auth: AuthService) {

    // this.coursesObservable = this.getCourses('/courses');
    // this.coursesObservable = this.getCoursesTeste();
    // console.log(this.coursesObservable);

    this.breadcrumbVisible.push({
      'nome': 'base',
      'key': 'base'
    });

    this.items = this.getCourses();

    /*
    this.items.forEach(teste => {
      console.log(teste);
    });
    */
  }

  ngOnInit() {
  }


  deletarItemStorage() {
    // removendo da storage
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${this.aDeletar.nome}`).delete();
    // console.log(`${this.basePath}/${this.aDeletar.nome}`);
    // removendo da base
    const itemsRef = this.db.list(this.breadcrumb + '/' + this.aDeletar.id);
    itemsRef.remove();
  }

  deletarItem() {
    const itemsRef = this.db.list(this.breadcrumb + '/' + this.aDeletar.id);
    itemsRef.remove();
    // this.aDeletar = null;
  }

  selecionar(item) {
    // console.log(this.breadcrumb + '/' + item.id);
    this.aDeletar = item;

    console.log(item);
  }

  // ------------------------


  selectFile(event) {
    this.progress.percentage = 0;
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
  }

  pushFileToStorage(fileUpload: File, progress: { percentage: number }) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.name}`).put(fileUpload);/* .then(res =>{
      console.log(res.downloadURL);
    }); */

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
        //console.log(reff);
        // console.log('está aqui');
        // fileUpload.url = uploadTask.snapshot.downloadURL
        // fileUpload.name = fileUpload.file.name
        //console.log(uploadTask);
        //console.log(uploadTask.snapshot);
        //console.log(this.basePath+"/"+fileUpload.name);
        //console.log(uploadTask.snapshot.ref.getDownloadURL);
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          //console.log('File available at', downloadURL);
          this.saveFileData(fileUpload, downloadURL);
        });
        //this.saveFileData(fileUpload, uploadTask.snapshot.downloadURL);
      }
    );

    /* uploadTask.on(firebase.storage.TaskState.SUCCESS, (ref) =>{
      console.log(ref);
    }) */
  }

  upload() {
    const file = this.selectedFiles.item(0)
    this.pushFileToStorage(file, this.progress);
  }

  private saveFileData(fileUpload: File, url) {
    console.log('colocando no banco');
    console.log(this.atual);
    console.log(url);
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


  addProblema() {
    this.db.list('/' + this.atual).push({
      nome: this.txtProblema,
      caminho: this.atual,
      tipo: 'prob'
    }).then(id => {
      console.log(id);

      var lenght = id.path.pieces_.length;
      var ele = id.path.pieces_[lenght - 1];
      var pai = id.path.pieces_[lenght - 2];

      this.db.list('/problemas/' + pai).push({
        nome: this.txtProblema,
        caminho: this.atual,
        seuId: ele
      })
    });

    /* this.db.list('/problemas').push({
      nome: this.txtProblema,
      caminho: this.atual
    }); */
    //console.log(this.atual);

  }

  addCourse() {
    this.db.list('/' + this.atual).push({
      dado: this.txtDado,
      final: this.chcFinal,
      tipo: 'normal'
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
    console.log(item);
    this.txtDado = '';

    this.breadcrumb = this.breadcrumb + '/' + item.id;
    // this.breadcrumbVisible = this.breadcrumbVisible + '/' + item.dado;
    var cor;
    if (!item.dado) {
      item.dado = item.nome;
      cor = 'red';
    }

    this.breadcrumbVisible.push({
      'nome': item.dado,
      'key': item.id,
      'cor': cor
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

  logout() {
    this.auth.logout();
  }


  /* collapseAllOptions() {
    $('.multi-collapse').collapse();
  } */

}
