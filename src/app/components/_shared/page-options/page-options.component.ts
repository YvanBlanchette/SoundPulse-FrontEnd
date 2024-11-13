import { AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { LibraryService } from '@/app/services/library.service';
import { RoutingService } from '@/app/services/routing.service';

@Component({
  selector: 'app-page-options',
  standalone: true,
  imports: [AsyncPipe, MatMenuModule],
  templateUrl: './page-options.component.html',
  styleUrl: './page-options.component.css'
})
export class PageOptionsComponent {
  @Input() itemDetails: any;

  constructor(
    public routingService: RoutingService,
    public libraryService: LibraryService,
    private cdr: ChangeDetectorRef
  ) { }

//! Function to add library item
addLibraryItem(): void {
  if (this.itemDetails) {
    const libraryItem: LibraryItem = {
      id: this.itemDetails.id,
      name: this.itemDetails.name,
      type: this.capitalize(this.itemDetails?.type),
      owner: this.getOwnerName(this.itemDetails) || '',
      owner_id: this.getOwnerId(this.itemDetails),
      image: [
        {
          url: this.itemDetails.images[0].url,
          width: this.itemDetails.images[0].width,
          height: this.itemDetails.images[0].height
        }
      ],
      created_at: this.itemDetails.created_at,
      updated_at: this.itemDetails.updated_at
    };

    this.libraryService.addLibraryItem(libraryItem).subscribe({
      next: (item) => {
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error adding library item:', error);
        alert(`Failed to add library item: ${error.error.message}`);
      }
    });
  }
}

//! Function to get owner name based on item type
private getOwnerName(itemDetails: any): string | undefined {
  switch (itemDetails.type) {
    case 'album':
      return itemDetails.artists?.[0]?.name;
    case 'artist':
      return itemDetails.name;
    default:
      return itemDetails.owner?.name;
  }
  }
  
//! Function to get owner ID based on item type
private getOwnerId(itemDetails: any): string | undefined {
  switch (itemDetails.type) {
    case 'album':
      return itemDetails.artists?.[0]?.id;
    case 'artist':
      return itemDetails.id;
    default:
      return itemDetails.owner?.id ?? undefined;
  }
}
  
  //! Function to capitalize first letter of a string
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  
    //! Function to remove library item
    removeLibraryItem(id: string): void {
      this.libraryService.removeLibraryItem(id).subscribe({
        next: (libraryItems) => {
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error removing library item:', error);
          alert(`Failed to remove library item: ${error.error.message}`);
        }
      });
    }
}
