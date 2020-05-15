import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { element } from 'protractor';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: String[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  constructor(private service: DataServiceService) {}

  ngOnInit(): void {
    this.service.getGlobalData().subscribe((result) => {
      this.data = result;
      this.data.forEach((element) => {
        this.countries.push(element.country);
      });
    });
  }

  updateValues(country: String) {
    console.log(country);
    this.data.forEach((element) => {
      if (element.country === country) {
        this.totalActive = element.active;
        this.totalDeaths = element.deaths;
        this.totalRecovered = element.recovered;
        this.totalConfirmed = element.confirmed;
      }
    });
    this.totalActive = this.numberWithCommas(this.totalActive);
    this.totalConfirmed = this.numberWithCommas(this.totalConfirmed);
    this.totalDeaths = this.numberWithCommas(this.totalDeaths);
    this.totalRecovered = this.numberWithCommas(this.totalRecovered);
  }

  numberWithCommas(number) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
