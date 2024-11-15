import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FormatSongDuration',
  standalone: true
})
export class FormatSongDurationPipe implements PipeTransform {
  transform(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}