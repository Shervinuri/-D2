import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  iframeFilterStyle = 'hue-rotate(11deg) saturate(13%) brightness(103%) contrast(200%)';
}