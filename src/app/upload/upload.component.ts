import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FileParameters, FireStorageService } from '../firestorage.service';

export type FileType = 'document' | 'image'; 

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() FileType: FileType;
  inputText = 'Přidat soubor';

  get acceptFileTypes() {
    switch (this.FileType) {
      case 'document':
        return '.doc,.docx,.pdf,.txt';
  
      case 'image':
        return '.jpg,.jpeg,.png,.gif';
    }
  }
  path: string;
  filesArray: FileParameters[] = [];

  constructor(
    public _snackBar: MatSnackBar,
    public fireStorageService: FireStorageService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.forEach(param => {
      this.path = param.get('category') ? decodeURI(param.get('category')) : 'Documents';
    })
    
  }

  uploadInputClick() {
    document.getElementById('upload').click();
  }

  getValue(event: Event, index: number){
    const checked = (event.target as HTMLInputElement).checked;
    this.filesArray[index].private = checked;
  }
  getTextValue(event: Event, index: number){
    const category = (event.target as HTMLInputElement).value;
    this.filesArray[index].category = category;
  }

  files(event: Event){
    const files = (event.target as HTMLInputElement).files;
    for(let i = 0; i < files.length; i++){
      const file = files.item(i);
      if(this.filesArray !== undefined || this.filesArray[i] !== undefined){
        if(!this.filesArray.includes({file: file})){
          this.filesArray.push({file: file, category: this.path, private: false});
        }
      } else {
        this.filesArray.push({file: file, category: this.path, private: false});
      } 
    }
  }

  removeFile(index: number){
    const deletedFile = this.filesArray[index].file.name;
    this._snackBar.open(`Soubor ${deletedFile} odstraněn`, null, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
    this.filesArray.splice(index, 1);
  }

}
