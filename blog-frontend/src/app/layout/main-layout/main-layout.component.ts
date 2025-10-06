import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

declare var Prism: any;

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatSidenavModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  
  readonly currentUser = this.authService.currentUser;
  readonly isMobileMenuOpen = signal(false);

  ngOnInit(): void {
    // Initialize Prism for syntax highlighting
    setTimeout(() => {
            if (Prism && Prism.plugins.autoloader) {
                Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
                Prism.highlightAll(); // Re-highlight all code blocks
            }
        }, 0);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
