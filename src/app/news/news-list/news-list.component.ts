import { Component, OnInit } from '@angular/core';
import { NewsService, News } from '../news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})

export class NewsListComponent implements OnInit {
  list: News[];
  constructor(public service: NewsService, public router: Router) {
  }

  ngOnInit() {
    this.service.getListOfNews().subscribe(result => {
      this.list = result.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data() as News
        } as News;
      });
    });
  }
}
