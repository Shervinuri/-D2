import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-controls',
  templateUrl: './filter-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterControlsComponent {
  hue = input.required<number>();
  saturate = input.required<number>();
  brightness = input.required<number>();
  contrast = input.required<number>();

  hueChange = output<string>();
  saturateChange = output<string>();
  brightnessChange = output<string>();
  contrastChange = output<string>();

  onHueChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.hueChange.emit(target.value);
  }

  onSaturateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.saturateChange.emit(target.value);
  }

  onBrightnessChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.brightnessChange.emit(target.value);
  }

  onContrastChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.contrastChange.emit(target.value);
  }
}
