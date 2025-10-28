import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface ReportDialogData {
  type: 'Post' | 'User';
  targetName: string;
}

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <div class="report-dialog">
      <h2 mat-dialog-title>REPORT {{ data.type | uppercase }}</h2>
      <mat-dialog-content>
        <p>You are reporting: <strong>{{ data.targetName }}</strong></p>
        <form [formGroup]="reportForm">
          <mat-form-field appearance="outline">
            <mat-label>Reason for reporting</mat-label>
            <textarea
              matInput
              formControlName="reason"
              rows="5"
              maxlength="1000"
              placeholder="Please provide details about why you are reporting this content."
            ></textarea>
            <mat-hint align="end">{{ reportForm.get('reason')?.value?.length || 0 }} / 1000</mat-hint>
            @if (reportForm.get('reason')?.hasError('required')) {
              <mat-error>A reason is required.</mat-error>
            }
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">CANCEL</button>
        <button
          mat-raised-button
          color="warn"
          (click)="onSubmit()"
          [disabled]="reportForm.invalid"
        >
          SUBMIT REPORT
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .report-dialog {
      font-family: 'Press Start 2P', cursive;
    }
    h2 {
      font-size: 14px;
      text-transform: uppercase;
      color: var(--pixel-error);
    }
    p {
      font-size: 9px;
      line-height: 1.6;
    }
    mat-form-field {
      width: 100%;
    }
    mat-dialog-actions button {
      font-family: 'Press Start 2P', cursive;
      font-size: 9px;
    }
  `]
})
export class ReportDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ReportDialogComponent>);
  readonly data = inject<ReportDialogData>(MAT_DIALOG_DATA);

  readonly reportForm = this.fb.group({
    reason: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      this.dialogRef.close(this.reportForm.value.reason);
    }
  }
}