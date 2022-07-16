import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { ObservableObject } from '../utilities/observable-object';
import { ObservableList } from '../utilities/observable-list';
import { SearchQuery } from '../models/search-query';
import { Tyre } from '../models/tyre';

@Injectable({
  providedIn: 'root',
})
export class TyreService extends ObservableObject<[]> {
  // Parser for tyres' information.
  private readonly __parser: Map<string, string> = new Map();

  // Server connection.
  private __webSocket?: WebSocket;

  // Observable list of tyres.
  readonly tyres = new ObservableList<Tyre>();

  constructor(private currencyPipe: CurrencyPipe) {
    super();
    this.__parser.set('rim_protector', $localize`Rim protection`);
    this.__parser.set('homologation', $localize`Homologation`);
    this.__parser.set('promotion', $localize`Promotion`);
    this.__parser.set('tyre_season', $localize`Season`);
    this.__parser.set('category', $localize`Category`);
    this.__parser.set('eletrico', $localize`Electric`);
    this.__parser.set('vehicle', $localize`Vehicle`);
    this.__parser.set('runflat', $localize`Runflat`);
    this.__parser.set('old_dot', $localize`Old dot`);
    this.__parser.set('tyre_type', $localize`Type`);
    this.__parser.set('type', $localize`Type`);
  }

  protected parse(tyre: Tyre): Tyre {
    // Parse information.
    for (const info of tyre.information) {
      // Parse description
      if (
        typeof info.description === 'string' ||
        info.description instanceof String
      )
        info.description = info.description
          .trim()
          .toLowerCase()
          .replace(/^\w/, (c: string) => c.toUpperCase());
      else if (
        typeof info.description === 'number' ||
        info.description instanceof Number
      )
        info.description = this.currencyPipe.transform(
          `${info.description}`,
          "EUR",
          'symbol'
        );
      else if (
        typeof info.description === 'boolean' ||
        info.description instanceof Boolean
      )
        info.description = info.description ? $localize`Yes` : $localize`No`;

      // Check if description is valid
      if (
        typeof info.description === 'string' ||
        info.description instanceof String
      ) {
        // Get key
        let key = this.__parser.get(info.name);

        // Check key
        if (key !== undefined && key !== null)
          // Parse key
          key = key
            .trim()
            .toLowerCase()
            .replace(/^\w/, (c: string) => c.toUpperCase());
        else if (info.name !== 'promotion_text')
          key = info.name
            .trim()
            .toLowerCase()
            .replace(/\_/gi, ' ')
            .replace(/^\w/, (c: string) => c.toUpperCase());

        // Check key
        if (key !== undefined && key !== null)
          info.description = `${key}: ${info.description}`;
      } else info.description = null;
    }
    // Parse tyre.
    return tyre;
  }

  request(searchQuery?: SearchQuery): void {
    // Check if the server is connected.
    if (!this.__webSocket) {

      // Create protocol.
      const webSocketProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';


      // Connect to the server.
      this.__webSocket = new WebSocket(`${webSocketProtocol}//${window.location.host}/tyres/`);

      // On close, reconnect.
      this.__webSocket.onclose = () => {
        this.__webSocket = undefined;
        this.notify([]);
      };

      // On message, add the tyre to the list.
      this.__webSocket.onmessage = (event) => {
        // Parse the message.
        const message = JSON.parse(event.data) as
          | {
              more: boolean;
              tyres: ReadonlyArray<Tyre>;
            }
          | {
              errors: ReadonlyArray<string>;
            };

        // Check if there are errors.
        if ('errors' in message)
          for (const error of message.errors) console.error(error);
        // Otherwise
        else {
          // Add the tyres to the list.
          for (const tyre of message.tyres) this.tyres.add(this.parse(tyre));

          // If there are more tyres, request more.
          if (message.more) this.request();
          else this.notify([]);
        }
      };
    }

    // Check if new search query is required.
    if (searchQuery) {
      // Clear list of tyres.
      this.tyres.clear();

      // Check if the web socket is already connected.
      if (this.__webSocket.readyState === WebSocket.OPEN)
        // Send the search query.
        this.__webSocket.send(
          JSON.stringify({
            term: `${searchQuery.term}`,
            quantity: searchQuery.quantity,
          })
        );
      // Otherwise
      // Request when it opens
      else this.__webSocket.onopen = () => this.request(searchQuery);
    } else {
      // Check if the web socket is already connected.
      if (this.__webSocket.readyState === WebSocket.OPEN)
        // Send the search query.
        this.__webSocket.send(JSON.stringify({}));
      // Otherwise
      // Request when it opens
      else this.__webSocket.onopen = () => this.request();
    }
  }
}
