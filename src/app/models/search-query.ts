import { Optional } from '../utilities/optional';

export interface SearchQuery {
  term: string | number;
  quantity: Optional<number>;
}
