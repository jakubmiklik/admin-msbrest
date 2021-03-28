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

  async ngOnInit() {
    const param = (await this.activatedRoute.paramMap.toPromise()).get('category');
    this.path = param ? decodeURI(param) : 'Photogallery';
    const list = await this.fireStorageService.getLists(this.path)
    if(list.prefixes){
      this.folders = list.prefixes;
    }
    if(list.items){
      list.items.forEach(async (item) => {
        this.photos.push({name: item.name, src: await item.getDownloadURL()});
      });
    }
  }

}
