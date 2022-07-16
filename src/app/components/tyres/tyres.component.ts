import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { TyreService } from 'src/app/services/tyre.service';
import { OrderedSet } from 'src/app/utilities/ordered-set';
import { Action } from 'src/app/utilities/action';
import { Tyre } from 'src/app/models/tyre';

@Component({
  selector: 'app-tyres',
  templateUrl: './tyres.component.html',
  styleUrls: ['./tyres.component.css'],
})
export class TyresComponent implements OnDestroy, OnInit {
  // The search query.
  searchQuery = {
    term: '',
    quantity: 4,
  };

  // Selected all brands toggle.
  selectedAllBrands = true;

  // Selected brands.
  selectedBrands = Array<boolean>();

  // Sorting order.
  sorting: 'asc' | 'desc' = 'asc';

  // Text filter.
  textFilter = '';

  // Create database.
  private readonly __dataBase = new Map<string, Set<Tyre>>();

  // Create tyres and brands.
  private readonly __tyres = new OrderedSet<Tyre>((a, b) => a.price - b.price);
  private readonly __brands = new OrderedSet<string>();

  // Subscription for listening to the tyre service.
  private __tyresSubscription?: Subscription;
  private __tyreSubscription?: Subscription;

  // Whether at least one request has been made.
  private __submitted = false;

  // Whether the service is loading products.
  private __loading = false;

  constructor(
    private offcanvasService: NgbOffcanvas,
    private tyreService: TyreService
  ) {}

  get brands(): OrderedSet<string> {
    return this.__brands;
  }

  get loading(): boolean {
    return this.__loading;
  }

  ngOnDestroy(): void {
    if (this.__tyreSubscription) this.__tyreSubscription.unsubscribe();
    if (this.__tyresSubscription) this.__tyresSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // Subscribe to the tyre service.
    this.__tyresSubscription = this.tyreService.observable.subscribe(() => {
      this.__loading = false;
    });

    // Subscribe to the brands.
    this.__tyreSubscription = this.tyreService.tyres.observable.subscribe(
      ([tyres, action, index]) => {
        if (action === Action.Add) {
          // Get tyre.
          const tyre = tyres[index];

          // Get brand.
          const brand = tyre.brand.description
            .replace(/\s+/g, '')
            .toLowerCase();

          // Get brand tyre set.
          let tyreSet = this.__dataBase.get(brand);

          // Check if brand tyre set is undefined.
          if (tyreSet === undefined || tyreSet === null) {
            // Create brand tyre set.
            tyreSet = new Set<Tyre>();

            // Add brand tyre set to database.
            this.__dataBase.set(brand, tyreSet);

            // Add brand to brands.
            const index = this.__brands.add(brand);

            // Add brand to selected brands.
            this.selectedBrands.splice(index, 0, this.selectedAllBrands);
          }

          // Add tyre to brand tyre set.
          tyreSet.add(tyre);

          // Check if brand is selected.
          const selected = this.__brands.find(brand);
          if (selected !== -1 && this.selectedBrands[selected])
            // Add tyre to tyres.
            this.__tyres.add(tyre);
        } else if (index !== undefined && index !== null) {
          // Get tyre.
          const tyre = tyres[index];

          // Get brand.
          const brand = tyre.brand.description
            .replace(/\s+/g, '')
            .toLowerCase();

          // Get brand tyre set.
          const tyreSet = this.__dataBase.get(brand);
          if (
            tyreSet !== undefined &&
            tyreSet !== null &&
            tyreSet.delete(tyre)
          ) {
            // Check if brand tyre set is empty.
            if (tyreSet.size === 0) {
              // Remove brand tyre set from database.
              this.__dataBase.delete(brand);

              // Remove brand from brands.
              const index = this.__brands.remove(brand);

              // Remove brand from selected brands.
              this.selectedBrands.splice(index, 1);
            }

            // Remove tyre from tyres.
            this.__tyres.remove(tyre);
          }
        } else {
          this.__tyres.clear();
          this.__brands.clear();
          this.__dataBase.clear();
          this.selectedAllBrands = true;
          this.selectedBrands.splice(0, this.selectedBrands.length);
        }
      }
    );
  }

  onChangeSelectedAllBrands(): void {
    // Set all brands to the selected all brands value.
    this.selectedBrands.fill(this.selectedAllBrands);

    // Update tyres.
    if (this.selectedAllBrands)
      for (const tyre of this.tyreService.tyres.items) this.__tyres.add(tyre);
    else this.__tyres.clear();
  }

  onChangeSelectedBrands(target: any): void {
    // Update selected all brands based on the selected brands.
    const element = document.getElementById(
      'check-__all__'
    ) as HTMLInputElement;
    this.selectedAllBrands = this.selectedBrands.every((selected) => selected);
    element.indeterminate =
      !this.selectedAllBrands &&
      !this.selectedBrands.every((selected) => !selected);

    // Update tyres.
    const brandList = this.__dataBase.get(target.value);
    if (brandList !== undefined && brandList !== null) {
      // Add tyres if element is checked, remove otherwise.
      if (target.checked) for (const tyre of brandList) this.__tyres.add(tyre);
      else for (const tyre of brandList) this.__tyres.remove(tyre);
    }
  }

  onChangeSorting(): void {
    if (this.sorting === 'asc')
      this.__tyres.comparator = (a, b) => a.price - b.price;
    else this.__tyres.comparator = (a, b) => b.price - a.price;
  }

  onImageError(element: any): void {
    element.remove();
  }

  onOffcanvasToggle(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, {
      ariaLabelledBy: 'offcanvas-label',
      scroll: true,
    });
  }

  onSubmit(): void {
    if (!this.__loading) {
      this.__loading = true;
      this.__submitted = true;
      this.tyreService.request(this.searchQuery);
    }
  }

  onTableImageError(element: any): void {
    element.parentElement.nextElementSibling.setAttribute('colSpan', 2);
    element.parentElement.remove();
  }

  get submitted(): boolean {
    return this.__submitted;
  }

  get tyres(): OrderedSet<Tyre> {
    return this.__tyres;
  }
}
