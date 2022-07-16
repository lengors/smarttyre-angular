import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    if (typeof value === 'string' || value instanceof String)
      value = new Date(value);
    const now = Date.now();
    const difference = now - value.getTime();
    const days = difference / (1000 * 60 * 60 * 24);
    let formattedDate = value.toLocaleDateString(
      undefined,
      days < 7
        ? { weekday: 'long' }
        : { month: 'long', day: 'numeric', year: 'numeric' }
    );
    if (value.getHours() !== 0)
      formattedDate = `${formattedDate}, ${value.toLocaleTimeString(undefined, {
        dayPeriod: 'long',
      })}`;
    return formattedDate;
  }
}
