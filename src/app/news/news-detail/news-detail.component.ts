import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService, News } from '../news.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  formData: News = {
    id: '',
    title: '',
    text: '',
    files: [],
    date: 0
  };
  files: FileList;
  complete: number[];
  inputText = 'Přidat soubory';

  async ngOnInit() {
    if(!this.isNoveltyNew){
      this.formData.id = await this.getNoveltyID();
      this.formData = (await this.getData(this.formData.id).toPromise()).data() as News;
    }
  }

  async getNoveltyID() {
    return (await this.route.paramMap.toPromise()).get('id');
  }

  getData(id: string) {
    return this.service.getNovelty(id);
  }

  editFiles(event: Event) {
    const inputFiles = this.service.getFilesFromInput(event);
    this.service.addFile(inputFiles, this.formData.id).subscribe((files) => {
      if (files.array !== undefined) {
        this.formData.files.push(...files.array);
      }
      this.complete = files.state;
      switch (inputFiles.length) {
        case 1:
          this.inputText = `${files[0].name}`;
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
    this.service.removeFile(this.formData.files[index]);
    this.formData.files.splice(index, 1);
  }

  onSubmit() {
    this.formData.date = new Date().getTime();
    this.isNoveltyNew ? this.service.addNovelty(this.formData) : this.service.editNovelty(this.formData);
    this.router.navigate(['/aktuality']);
  }

  uploadInputClick() {
    document.getElementById('upload').click();
  }
}
