import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthPlansService, MonthPlan } from '../month-plans.service';
import { NgForm } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface State {
  array: string[];
  state: number;
}

@Component({
  selector: 'app-month-plan',
  templateUrl: './month-plan.component.html',
  styleUrls: ['./month-plan.component.scss']
})
export class MonthPlanComponent implements OnInit {

  constructor(private route: ActivatedRoute, public service: MonthPlansService, private router: Router) {
    this.formData;
  }
  public Editor = ClassicEditor;
  formData: MonthPlan = {
    id: '',
    title: '',
    text: '',
    photos: new Array(),
  };
  files: FileList;
  complete: number[];
  inputText = 'Přidat fotografie';

  ngOnInit() {

    //this.formData

    // this.resetForm();
    this.getNoveltyID();
    this.getData(this.formData.id).subscribe((data) => {
      const form = data.data() as MonthPlan;
      if (form) {
        this.formData = form;
        console.log(this.formData);
      }
    });

  }

  getNoveltyID() {
    this.route.paramMap.subscribe((params) => {
      this.formData.id = params.get('id');
    });
  }

  getData(id: string) {
    return this.service.getNovelty(id);
  }

  editPhotos(event: Event) {
    const files = this.service.getFilesFromInput(event);
    this.service.addPhoto(files, this.formData.id).subscribe((photos) => {
      if (photos.array !== undefined) {
        this.formData.photos.push(...photos.array);
      }
      this.complete = photos.state;
      switch (files.length) {
        case 1:
          this.inputText = `${files[0].name}`;
          break;
        case 2:
        case 3:
        case 4:
          this.inputText = `Zvoleny ${files.length} soubory`;
          break;
        case 5:
        default:
          this.inputText = `Zvoleno ${files.length} souborů`;
          break;
      }
    });
  }

  removePhoto(index: number) {
    this.service.removePhoto(this.formData.photos[index]);
    this.formData.photos.splice(index, 1);
  }

  onSubmit(form: NgForm) {

    this.formData.id = form.value.id;
    this.formData.title = form.value.title;
    this.formData.text = form.value.article;
    console.log(this.formData);
    this.service.editNovelty(this.formData);
    this.router.navigate(['/mesicni-plany']);
  }

  uploadInputClick() {
    document.getElementById('upload').click();
  }
}
