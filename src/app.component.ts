import { Component, ChangeDetectionStrategy, signal, OnInit, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class AppComponent implements OnInit {
  readonly deferredPrompt = signal<any | null>(null);
  readonly isDesktopView = signal(false);

  // Signals for filter controls
  readonly hue = signal(11);
  readonly saturate = signal(13);
  readonly brightness = signal(103);
  readonly contrast = signal(200);

  // Computed signal for the iframe filter style
  readonly iframeFilterStyle = computed(() => 
    `hue-rotate(${this.hue()}deg) saturate(${this.saturate()}%) brightness(${this.brightness()}%) contrast(${this.contrast()}%)`
  );
  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
  
  private checkViewport(): void {
    if (this.isBrowser()) {
      // Show desktop warning if aspect ratio is landscape or width is too large
      const isLandscape = window.innerWidth > window.innerHeight;
      const isTooWide = window.innerWidth > 768;
      this.isDesktopView.set(isLandscape || isTooWide);
    }
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.checkViewport();

      window.addEventListener('beforeinstallprompt', (e: Event) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt.set(e);
      });

      window.addEventListener('appinstalled', () => {
        // Hide the install button
        this.deferredPrompt.set(null);
        console.log('PWA was installed');
      });
    }
  }

  onResize(): void {
    this.checkViewport();
  }

  installPwa(): void {
    const promptEvent = this.deferredPrompt();
    if (!promptEvent) {
      return;
    }

    // Show the install prompt
    promptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    promptEvent.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      // We can only use the prompt once, hide the button.
      this.deferredPrompt.set(null);
    });
  }
}
