import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { TyresComponent } from './components/tyres/tyres.component';
import { ParseCrawlerPipe } from './pipes/parse-crawler.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TextFilterPipe } from './pipes/text-filter.pipe';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    FormatDatePipe,
    ParseCrawlerPipe,
    TextFilterPipe,
    TyresComponent,
  ],
  imports: [BrowserModule, FormsModule, NgbModule],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
