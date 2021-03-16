import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FireStorageService } from '../firestorage.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  folders;
  files = [];
  path;

  constructor(
    public fireStorageService: FireStorageService, 
    public activatedRoute: ActivatedRoute, 
    public router: Router,
    public _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      params.get('category')? this.path = decodeURI(params.get('category')) : this.path = 'Documents';
      this.fireStorageService.getLists(this.path).then(cat => {
        if(cat.prefixes){
          this.folders = cat.prefixes;
        }
        if(cat.items){
          cat.items.forEach(e => {
            e.getDownloadURL().then(f=> {
              this.files.push({ref: e, name: e.name, src: f});
            })
          })
        }
      });
    });
  }
  removeFolder(index: number){
    this.folders[index].listAll().then((files) => {
      files.items.forEach((file) => {
        file.delete();
      });
      this._snackBar.open(`Složka úspěšně smazána`, null,{
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      window.location.reload(); 
    });
  }

}
