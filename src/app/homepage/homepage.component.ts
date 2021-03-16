
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  date = new Date(Date.now());
  absence = [];
  countOfAbsence = 0;
  calendar = {
    day: this.date.getDay(),
    dayOfMonth: this.date.getDate(),
    month: this.date.getMonth()
  }
  numberOfExcused: number = 0;

  get absenceText(){
    switch (this.countOfAbsence) {
      case 1:
        return 'Omluv. dítě'
      case 2:
      case 3:
      case 4:
        return 'Omluv. děti'
      default:
        return 'Omluv. dětí'
    }
  } 


  constructor(private http: HttpClient) {}

  async ngOnInit() {
    
    this.absence = (await this.http.get('https://us-central1-skolka-brest.cloudfunctions.net/app/users/children/getAllAbsence').toPromise() as any[]);
    this.countOfAbsence = this.getCountOfActualAbsence(this.absence);

  }

  getCountOfActualAbsence(array: any[]){
    return array.filter(abs => {
      const now = new Date().getTime();
      return abs.dateFrom < now && abs.dateTo >= now;
    }).length;
  }
}