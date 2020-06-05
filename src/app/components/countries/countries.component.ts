import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  data;
  countries: String[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  loading = true;
  datatable = [];
  defaultValue = 'Brazil';
  lineChart = {
    LineChart: 'LineChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
    },
  };

  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(
        map((result) => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map((result) => {
          this.data = result;
          this.data.forEach((cs) => {
            this.countries.push(cs.country);
          });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('Brazil');
        this.loading = false;
      },
    });
  }

  updateChart() {
    this.datatable = [];
    //this.datatable.push(['Data', 'Casos']);
    this.selectedCountryData.forEach((element) => {
      this.datatable.push([element.date, element.cases]);
    });
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach((element) => {
      if (element.country === country) {
        this.totalActive = element.active;
        this.totalDeaths = element.deaths;
        this.totalRecovered = element.recovered;
        this.totalConfirmed = element.confirmed;
      }
    });

    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
    console.log(this.selectedCountryData);

    this.totalActive = this.numberWithCommas(this.totalActive);
    this.totalConfirmed = this.numberWithCommas(this.totalConfirmed);
    this.totalDeaths = this.numberWithCommas(this.totalDeaths);
    this.totalRecovered = this.numberWithCommas(this.totalRecovered);
  }

  numberWithCommas(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
