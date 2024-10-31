//* Module imports
import { Component } from "@angular/core";

//* Component imports
import { SongDetailsComponent } from "@/app/components/_footer/song-details/song-details.component";
import { PlayerComponent } from "@/app/components/_footer/player/player.component";
import { VolumeControlsComponent } from "@/app/components/_footer/volume-controls/volume-controls.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SongDetailsComponent, PlayerComponent, VolumeControlsComponent],
  templateUrl: './footer.component.html',
})
  
export class FooterComponent {}