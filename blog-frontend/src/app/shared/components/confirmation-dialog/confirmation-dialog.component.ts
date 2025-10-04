import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-icon" [class]="data.type || 'warning'">
        <mat-icon>
          @if (data.type === 'danger') {
            error_outline
          } @else if (data.type === 'info') {
            info_outline
          } @else {
            warning
          }
        </mat-icon>
      </div>

      <h2 mat-dialog-title>{{ data.title }}</h2>
      
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button 
          mat-raised-button 
          [color]="data.type === 'danger' ? 'warn' : 'primary'"
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      text-align: center;
      padding: 1rem;
    }

    .dialog-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      &.danger {
        background: #fee2e2;
        mat-icon {
          color: #ef4444;
        }
      }

      &.warning {
        background: #fef3c7;
        mat-icon {
          color: #f59e0b;
        }
      }

      &.info {
        background: #dbeafe;
        mat-icon {
          color: #3b82f6;
        }
      }
    }

    h2 {
      margin: 0 0 1rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    mat-dialog-content {
      padding: 0 1rem 1.5rem;

      p {
        margin: 0;
        color: #6b7280;
        line-height: 1.6;
      }
    }

    mat-dialog-actions {
      padding: 1rem;
      gap: 0.5rem;
    }
  `]
})
export class ConfirmationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}