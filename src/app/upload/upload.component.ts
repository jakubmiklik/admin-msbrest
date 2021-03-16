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
  get inputText() {
    switch (this.FileType) {
      case 'document':
        return 'Přidat dokument';
  
      case 'image':
        return 'Přidat obrázek';
    }
  }
  get acceptFileTypes() {
    switch (this.FileType) {
      case 'document':
        return '.doc,.docx,.pdf,.txt';
  
      case 'image':
        return '.jpg,.jpeg,.png,.gif';
    }
  }
  category: string;
  filesArray: FileParameters[] = [];

  constructor(
    public _snackBar: MatSnackBar,
    public fireStorageService: FireStorageService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      params.get('category')? this.category = decodeURI(params.get('category')) : this.category = 'Documents';
    });
  }

  encodeURI(category: string){
    return encodeURI(category);
  }

  decodeURI(string: string){
    return decodeURI(string);
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
        if(!this.filesArray.includes({file: files.item(i)})){
          this.filesArray.push({file: file, category: this.category, private: false});
        }
      } else {
        this.filesArray.push({file: file, category: this.category, private: false});
      } 
    }
  }

  removeFile(index: number){
    const deletedFile: string = this.filesArray[index].file.name;
    this._snackBar.open(`Soubor ${deletedFile} odstraněn`, null,{
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
    this.filesArray.splice(index, 1);
  }

}
