import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthPlansService, MonthPlan } from '../month-plans.service';
import { NgForm } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';



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
  isNewMonthPlan = true;
  complete: number[];
  inputText = 'Přidat fotografie';

  ngOnInit() {

    this.getNoveltyID();
    this.getData(this.formData.id).subscribe((data) => {
      const form = data.data() as MonthPlan;

      if (form) {
        this.formData = form;
        this.isNewMonthPlan = false;
        console.log(this.formData);
      }
      console.log(this.isNewMonthPlan);
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

  onSubmit(form: NgForm) {

    this.formData.id = form.value.id;
    this.formData.title = form.value.title;
    this.formData.text = form.value.article;
    this.isNewMonthPlan ? this.service.addNovelty(this.formData) : this.service.editNovelty(this.formData);
    
    this.router.navigate(['/mesicni-plany']);
  }

  uploadInputClick() {
    document.getElementById('upload').click();
  }
}
