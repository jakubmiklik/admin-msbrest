import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService, News } from '../news.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FileInfo } from './../news.service';

export interface State {
  array: string[];
  state: number;
}

@Component({
  selector: 'app-novelty',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, public service: NewsService, private router: Router) {
  }

  get isNoveltyNew(){
    return this.router.url.includes('pridat');
  }

  public Editor = ClassicEditor;
  formData = new NewsClass('', '', '', [], 0);
  files: FileList;
  complete: number[];
  inputText = 'Přidat soubory';

  async ngOnInit() {
    this.formData.files = [];
    if(!this.isNoveltyNew){
      this.route.paramMap.subscribe(async (params) => {
        this.formData.id = params.get('id');
        this.formData = (await this.getData(this.formData.id).toPromise()).data() as News;
      })
    }
  }

  getData(id: string) {
    return this.service.getNovelty(id);
  }

  editFiles(event: Event) {
    const inputFiles = this.service.getFilesFromInput(event);
    this.service.addFile(inputFiles, this.formData.id).subscribe((files) => {
      if (files.array !== undefined) {
        files.array.forEach((src, index) => {
          this.formData.files.push(
          {
            src: src, 
            type: inputFiles.item(index).type, 
            name: inputFiles.item(index).name
          })
        })
        
      }
      this.complete = files.state;
      switch (inputFiles.length) {
        case 1:
          this.inputText = `${inputFiles[0].name}`;
          break;
        case 2:
        case 3:
        case 4:
          this.inputText = `Zvoleny ${inputFiles.length} soubory`;
          break;
        case 5:
        default:
          this.inputText = `Zvoleno ${inputFiles.length} souborů`;
          break;
      }
    });
  }

  removeFile(index: number) {
    this.service.removeFile(this.formData.files[index].src);
    this.formData.files.splice(index, 1);
  }

  onSubmit() {
    this.formData.date = new Date().getTime();
    this.isNoveltyNew ? this.service.addNovelty(this.formData as News) : this.service.editNovelty(this.formData as News);
    this.router.navigate(['/aktuality']);
  }

  uploadInputClick() {
    document.getElementById('upload').click();
  }
}

class NewsClass {
  constructor(public id?: string, public title?: string, public text?: string, public files?: FileInfo[], public date?: number){
  }
}