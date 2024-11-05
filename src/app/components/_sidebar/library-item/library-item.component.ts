//* Module imports
import { Component, Input} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';


@Component({
  selector: 'app-library-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './library-item.component.html',
})
export class LibraryItemComponent {
  @Input() item!: LibraryItem;

  constructor(private router: Router) { }

  onSelectItem(item: LibraryItem): void {
    switch (item.type) {
      case 'Favorites':
        this.router.navigate([`/favourites`]);
        break;
      case 'Artiste':
        this.router.navigate([`/artists/${item.id}`]);
        break;
      case 'Album':
        this.router.navigate([`/albums/${item.id}`], { queryParams: { artistId: item.owner_id } });
        break;
      case 'Liste de lecture':
        this.router.navigate([`/playlists/${item.id}`]);
        break;
      case 'Chanson':
        this.router.navigate([`/tracks/${item.id}`]);
        break;
    }
  }
}