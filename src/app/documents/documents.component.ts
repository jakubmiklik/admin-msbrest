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

  async ngOnInit() {
    const param = (await this.activatedRoute.paramMap.toPromise()).get('category');
    this.path = param ? decodeURI(param) : 'Documents';
    const list = await this.fireStorageService.getLists(this.path)
    if(list.prefixes){
      this.folders = list.prefixes;
    }
    if(list.items){
      list.items.forEach(async (item) => {
        this.files.push({name: item.name, src: await item.getDownloadURL()});
      });
    }
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
      location.reload(); 
    });
  }

}
