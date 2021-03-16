import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireStorageService } from '../firestorage.service';

@Component({
  selector: 'app-photogallery',
  templateUrl: './photogallery.component.html',
  styleUrls: ['./photogallery.component.scss']
})
export class PhotogalleryComponent implements OnInit {

  folders;
  photos = [];
  path;

  constructor(public fireStorageService: FireStorageService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      params.get('category')? this.path = decodeURI(params.get('category')) : this.path = 'Photogallery';
      this.fireStorageService.getLists(this.path).then(cat => {
        if(cat.prefixes){
          this.folders = cat.prefixes;
        }
        if(cat.items){
          cat.items.forEach(e => {
            e.getDownloadURL().then(f=> {
              this.photos.push(f);
            })
          })
        }
      });
    });
  }

}
