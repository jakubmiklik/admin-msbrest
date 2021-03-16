import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-omluvenky',
  templateUrl: './omluvenky.component.html',
  styleUrls: ['./omluvenky.component.scss']
})
export class OmluvenkyComponent implements OnInit {

  period = 'present';
  absence = [];

  get filteredAbsence(){
    return this.absence.filter(abs => {
      const now = new Date().getTime();
      switch (this.period) {
        case 'past':
          return abs.dateTo < now;
        case 'present':
          return abs.dateFrom < now && abs.dateTo >= now;
        case 'future':
          return abs.dateFrom > now;
      }
    })
  }

  constructor(public http: HttpClient) { }

  async ngOnInit() {
    this.absence = (await this.http.get('https://us-central1-skolka-brest.cloudfunctions.net/app/users/children/getAllAbsence').toPromise() as any[]);
  }

  

  getSelectedOption(event: Event): string {
    const element = event.target as HTMLSelectElement;
    return element.value;
  }
}