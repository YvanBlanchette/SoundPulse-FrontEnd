//* Module imports
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

//* Interface imports
import { LibraryItem } from '@/app/interfaces/library-item';

//* Service imports
import { SelectedLibraryItemService } from '@/app/services/selected-library-item.service';

@Component({
  selector: 'app-library-item',
  standalone: true,
  imports: [],
  templateUrl: './library-item.component.html',
})
export class LibraryItemComponent {
  @Input() item!: LibraryItem;
  @Output() selected = new EventEmitter<LibraryItem>();

  constructor(private selectedLibraryItemService: SelectedLibraryItemService) { }

  // Emits selected library item
  onSelect(): void {
    this.selected.emit(this.item);
    this.selectedLibraryItemService.setSelectedItem(this.item);
    console.log('Selected item: ', this.item);
  }
}