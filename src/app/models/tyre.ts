import { Optional } from '../utilities/optional';

import { Brand } from './brand';
import { Stock } from './stock';
import { Info } from './info';

export interface Tyre {
  url: string;
  crawler: string;
  description: string;
  image: Optional<string>;
  brand: Brand;
  price: number;
  stock: Stock[];
  grip: Optional<string>;
  noise: Optional<number>;
  decibels: Optional<number>;
  consumption: Optional<string>;
  information: Info[];
}
