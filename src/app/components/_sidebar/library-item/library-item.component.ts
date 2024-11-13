//* Module imports
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';
import { LibraryService } from '@/app/services/library.service';


@Component({
  selector: 'app-library-item',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './library-item.component.html',
  styleUrls: ['./library-item.component.css']
})
export class LibraryItemComponent {
  @Input() item!: LibraryItem;

  constructor(private router: Router, private libraryService: LibraryService, private cdr: ChangeDetectorRef) {}

  onSelectItem(item: LibraryItem): void {
    switch (item.type) {
      case 'favorites':
        this.router.navigate([`/favourites`]);
        break;
      case 'Artist':
        this.router.navigate([`/artists/${item.id}`]);
        break;
      case 'Album':
        this.router.navigate([`/albums/${item.id}`], { queryParams: { artistId: item.owner_id } });
        break;
      case 'Playlist':
        this.router.navigate([`/playlists/${item.id}`]);
        break;
      case 'Track':
        this.router.navigate([`/tracks/${item.id}`]);
        break;
    }
  }

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