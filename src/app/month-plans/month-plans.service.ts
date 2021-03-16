import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

interface State {
  array: string[];
  state: number[];
}

export interface MonthPlan {
  id?: string;
  title: string;
  text: string;
  photos?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MonthPlansService {

  constructor(public db: AngularFirestore, private storage: AngularFireStorage) {
  }

  getListOfNews() {
    return this.db.collection('month-plan').snapshotChanges();
  }

  getNovelty(id: string) {
    return this.db.doc('month-plan/' + id).get();
  }
  editNovelty(data: MonthPlan) {
    this.db.collection('month-plan').doc(data.id).update(data);
  }

  addNovelty(data: MonthPlan) {
    this.db.collection('month-plan').doc(data.id).set(data);
  }

  removeItemFromList(id: string) {
    this.db.doc('month-plan/' + id).delete();
  }

  getFilesFromInput(event: Event): FileList {
    return (event.target as HTMLInputElement).files;
  } // v pořádku

  addPhoto(files: FileList, id: string) {

    return new Observable<State>((observer) => {
      const arrayOfUrls = [];
      const complete = [];
      for (let i = 0; i < files.length; i++) {
        const ref = `month-plan/${id}/${files.item(i).name}`;
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

  removePhoto(url: string) {
    this.storage.storage.refFromURL(url).delete().then(() => console.log('Odstraněno.'));
  }
}
