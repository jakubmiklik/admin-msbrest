import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface FileParameters {
  file?: File,
  private?: boolean,
  category?: string
}

@Injectable({
  providedIn: 'root'
})

export class FireStorageService {
  
  constructor(
    public storage: AngularFireStorage,
    public _snackBar: MatSnackBar,
  ) { }

  getLists(path: string) {
    return this.storage.storage.refFromURL('gs://skolka-brest.appspot.com').child(path).listAll();
  }
  
  uploadFiles(actualFiles: FileParameters[]){
    actualFiles.forEach(file => {
      this.storage.storage.ref(`${file.category}/${file.file.name}`).put(file.file, {
        contentType: file.file.type,
        cacheControl: 'public, max-age=2419200', 
        customMetadata: {
          private: `${file.private}`
        }
      }).then(task => {
        console.log(task.state);
      })
    })
  }
}
