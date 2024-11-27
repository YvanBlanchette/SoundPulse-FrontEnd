import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [NgIf],
  template: `
  <footer class="bg-gradient-to-br from-[#00C4FF] to-[#F700FD] text-xs tracking-wide font-medium py-1 animate-pulse">
    <p *ngIf="showFrench" class="text-center">
      AVERTISSEMENT : Ce projet web à vocation exclusivement éducative a été créé dans le cadre de l'AEC en développement web du Cégep de Trois-Rivières par 
      <a href="mailto:yvanblanchette@outlook.com" class="hover:underline text-gray-800">Yvan Junior Blanchette</a>. 
      Toutes les images et extraits sonores proviennent directement de l'API Spotify.
    </p>
    <p *ngIf="!showFrench" class="text-center">
      DISCLAIMER: This educational web project was created as part of the Web Development AEC program at Cégep de Trois-Rivières by 
      <a href="mailto:yvanblanchette@outlook.com" class="hover:underline text-gray-800">Yvan Junior Blanchette</a>. 
      All images and audio excerpts come directly from the Spotify API.
    </p>
  </footer>
`,
})
export class DisclaimerComponent {
  showFrench = true;

  ngOnInit(): void {
    setInterval(() => {
      this.showFrench = !this.showFrench;
    }, 10000);
  }
}