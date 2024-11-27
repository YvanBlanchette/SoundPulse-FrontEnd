import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

//* Component imports
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { LibraryService } from '@/app/services/library.service';


@Component({
  selector: 'app-library-item',
  standalone: true,
  imports: [RouterModule, NgClass, MatTooltipModule, MatIconModule],
  templateUrl: './library-item.component.html',
  styleUrls: ['./library-item.component.css']
})


export class LibraryItemComponent implements OnChanges {
  @Input() item!: LibraryItem;
  @Output() removeItem = new EventEmitter<string>();


  // Constructor with dependency injection
  constructor(
    private router: Router,
    private libraryService: LibraryService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnChanges(changes: SimpleChanges) {
    if (changes['item']) {
      this.cdr.detectChanges();
    }
  }


  // Function to navigate to the item's page
  onSelectItem(item: LibraryItem): void {
    switch (item.type) {
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


  // Function to remove a library item and emit an event
  removeLibraryItem(id: string): void {
    this.removeItem.emit(id);
  }
}