import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        console.log(result);
        this.globalData = result;
        result.forEach((element) => {
          if (!Number.isNaN(element.confirmed)) {
            this.totalActive += element.active;
            this.totalConfirmed += element.confirmed;
            this.totalDeaths += element.deaths;
            this.totalRecovered += element.recovered;
          }
        });
        this.totalActive = this.numberWithCommas(this.totalActive);
        this.totalConfirmed = this.numberWithCommas(this.totalConfirmed);
        this.totalDeaths = this.numberWithCommas(this.totalDeaths);
        this.totalRecovered = this.numberWithCommas(this.totalRecovered);
      },
    });
  }

  numberWithCommas(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
