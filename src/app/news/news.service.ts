import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

interface State {
  array: string[];
  state: number[];
}

export interface FileInfo{
  type: string;
  src: string;
  name: string;
}

export interface News {
  id?: string;
  title: string;
  text: string;
  files: FileInfo[];
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
  }

  addFile(files: FileList, id: string) {

    return new Observable<State>((observer) => {
      const arrayOfUrls = [];
      const complete = [];
      for (let i = 0; i < files.length; i++) {
        const ref = `articles/${id}/${files.item(i).name}`;
        const storageRef = this.storage.ref(ref);
        const task = storageRef.put(files.item(i), {contentType: files.item(i).type});
        task.percentageChanges().subscribe(state => {
          complete[i] = Math.round(state);
          observer.next({state: complete} as State);
        });
        task.then(test => {
          test.ref.getDownloadURL().then(url => {
            arrayOfUrls.push(url);
            if (arrayOfUrls.length === files.length) {
              observer.next({array: arrayOfUrls} as State);
              observer.complete();
            }
          });
        });
      }
    });
  }

  removeFile(url: string) {
    this.storage.storage.refFromURL(url).delete().then(() => console.log('Odstraněno.'));
  }
}
