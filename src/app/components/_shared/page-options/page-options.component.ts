import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';
import { FavouritesService } from '@/app/services/favourites.service';


@Component({
  selector: 'app-page-options',
  standalone: true,
  imports: [AsyncPipe, MatMenuModule, MatIconModule],
  templateUrl: './page-options.component.html',
})

export class PageOptionsComponent {
  @Input() itemDetails: any;

  // Constructor with dependency injections
  constructor(
    public routingService: RoutingService,
    public libraryService: LibraryService,
    public favouritesService: FavouritesService,
    private cdr: ChangeDetectorRef
  ) { }


  // Function to add library item
  addLibraryItem(): void {
    // Check if itemDetails is defined
    if (this.itemDetails) {
      // Create the library item
      const libraryItem: LibraryItem = {
        id: this.itemDetails.id,
        name: this.itemDetails.name,
        type: this.capitalize(this.itemDetails?.type),
        owner: this.getOwnerName(this.itemDetails) || '',
        owner_id: this.getOwnerId(this.itemDetails),
        images: [
          {
            url: this.itemDetails.images[0].url,
            width: this.itemDetails.images[0].width,
            height: this.itemDetails.images[0].height
          }
        ],
        created_at: this.itemDetails.created_at,
        updated_at: this.itemDetails.updated_at
      };

      // Add the item to the library and handle errors
      this.libraryService.addLibraryItem(libraryItem).subscribe({
        error: (error: HttpErrorResponse) => {
          console.error('Error adding library item:', error);
          alert(`Failed to add library item: ${error.error.message}`);
        }
      });
    }
  }


  // Function to remove library item
  removeLibraryItem(id: string): void {
    // Remove the item from the library
    this.libraryService.removeLibraryItem(id).subscribe({
      next: (libraryItems) => {
        this.cdr.detectChanges();
      },
      // Handle potential errors
      error: (error: HttpErrorResponse) => {
        console.error('Error removing library item:', error);
        alert(`Failed to remove library item: ${error.error.message}`);
      }
    });
  }


  // Function to define the owner name based on item type
  private getOwnerName(itemDetails: any): string | undefined {
    switch (itemDetails.type) {
      case 'album':
        return itemDetails.artists?.[0]?.name;
      case 'artist':
        return itemDetails.name;
      case 'playlist':
        return itemDetails.owner?.display_name;
      default:
        return itemDetails.owner?.name;
    }
  }


  // Function to define the owner ID based on item type
  private getOwnerId(itemDetails: any): string | undefined {
    switch (itemDetails.type) {
      case 'album':
        return itemDetails.artists?.[0]?.id;
      case 'artist':
        return itemDetails.id;
      case 'playlist':
        return itemDetails.owner?.id;
      default:
        return itemDetails.owner?.id ?? undefined;
    }
  }


  // Helper function to capitalize first letter of a string
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
