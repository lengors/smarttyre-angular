import { Optional } from '../utilities/optional';

export type Info =
  | {
      name: string;
      description: String | string | Number | number | Boolean | boolean;
      image: Optional<string>;
    }
  | {
      name: string;
      description: Optional<
        String | string | Number | number | Boolean | boolean
      >;
      image: string;
    };
