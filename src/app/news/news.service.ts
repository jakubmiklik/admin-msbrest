import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

interface State {
  array: string[];
  state: number[];
}

export interface News {
  id?: string;
  title: string;
  text: string;
  files: string[];
  date?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(public db: AngularFirestore, private storage: AngularFireStorage) {
  }

  getListOfNews() {
    return this.db.collection('articles').snapshotChanges();
  }

  getNovelty(id: string) {
    return this.db.doc('articles/' + id).get();
  }
  editNovelty(data: News) {
    this.db.collection('articles').doc(data.id).update(data);
  }

  addNovelty(data: News) {
    const ref = this.db.collection('articles').doc().ref;
    ref.set(data)
  }

  removeItemFromList(id: string) {
    this.db.doc('articles/' + id).delete();
  }

  getFilesFromInput(event: Event): FileList {
    return (event.target as HTMLInputElement).files;
  } // v pořádku



  removeFile(url: string) {
    this.storage.storage.refFromURL(url).delete().then(() => console.log('Odstraněno.'));
  }
}
