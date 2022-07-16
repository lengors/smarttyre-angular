import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'parseCrawler' })
export class ParseCrawlerPipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace('crawler', '');
  }
}
