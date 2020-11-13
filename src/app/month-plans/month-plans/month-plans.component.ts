import { Component, OnInit } from '@angular/core';
import { MonthPlansService, MonthPlan } from '../month-plans.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-month-plans',
  templateUrl: './month-plans.component.html',
  styleUrls: ['./month-plans.component.scss']
})

export class MonthPlansComponent implements OnInit {
  list: MonthPlan[];
  constructor(public service: MonthPlansService, public router: Router) {
  }

  ngOnInit() {
    this.service.getListOfNews().subscribe(result => {
      this.list = result.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as MonthPlan
        } as MonthPlan;
      });
    });
  }

  makeID(length: number) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
