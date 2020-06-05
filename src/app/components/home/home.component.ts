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
  loading = true;
  globalData: GlobalDataSummary[];
  datatable = [];

  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };

  constructor(private dataService: DataServiceService) {}

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value);
  }

  initChart(caseType: string) {
    this.datatable = [];
    //this.datatable.push(['Países', 'Casos']);

    this.globalData.forEach((element) => {
      let value: number;
      if (caseType === 'c') {
        if (element.confirmed > 5000) {
          value = element.confirmed;
        }
      }
      if (caseType === 'a') {
        if (element.confirmed > 5000) {
          value = element.active;
        }
      }
      if (caseType === 'm') {
        if (element.confirmed > 5000) {
          value = element.deaths;
        }
      }
      if (caseType === 'r') {
        if (element.confirmed > 5000) {
          value = element.recovered;
        }
      }

      this.datatable.push([element.country, value]);
    });
  }
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

        this.initChart('c');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  numberWithCommas(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
