import { Pipe, PipeTransform } from '@angular/core';

import { Tyre } from '../models/tyre';

@Pipe({ name: 'textFilter', pure: false })
export class TextFilterPipe implements PipeTransform {
  filter(term: string, tyre: Tyre): boolean {
    let position = 0;
    const description = tyre.description.toLowerCase();
    for (const character of term) {
      position = description.indexOf(character, position);
      if (position === -1) {
        const words = description.split(' ');
        for (const word of term.split(' '))
          if (words.indexOf(word) === -1) return false;
        return true;
      }
      ++position;
    }
    return true;
  }

  transform(tyres: Iterable<Tyre>, term: string): Tyre[] {
    // Create a result array.
    const result = Array<Tyre>();

    // Parse the term into a lowercase string.
    term = term.trim().replace(/\s+/g, ' ').toLowerCase();

    // For each tyre, check if the term is contained in the tyre's name.
    for (const tyre of tyres) if (this.filter(term, tyre)) result.push(tyre);

    // Return the result.
    return result;
  }
}
