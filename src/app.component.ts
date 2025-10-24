import { Component, ChangeDetectionStrategy, signal, OnInit, computed } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AppComponent implements OnInit {
  readonly deferredPrompt = signal<any | null>(null);

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

  ngOnInit(): void {
    if (this.isBrowser()) {
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