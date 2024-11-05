import { MatButtonModule } from '@angular/material/button';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

//* Component imports
import { HeaderComponent } from "@/app/components/header/header.component";
import { SidebarComponent } from "@/app/components/sidebar/sidebar.component";
import { MainComponent } from "@/app/components/main/main.component";
import { FooterComponent } from "@/app/components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements AfterViewInit {
  title = 'SoundPulse';
  @ViewChild('sidenav') sidenav?: MatSidenav;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.sidenav) {
        this.sidenav.open();
        this.sidenav.disableClose = true;
      }
    });
  }

  toggleSidenav() {
    this.sidenav?.toggle();
  }
}
