import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "@/app/components/header/header.component";
import { FooterComponent } from '@/app/components/footer/footer.component';
import { MainComponent } from '@/app/components/main/main.component';
import { SidebarComponent } from '@/app/components/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    FooterComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayout implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.sidenav.open();
    // Allow the sidenav to open before detecting changes
    this.cdr.detectChanges();
  }
}
