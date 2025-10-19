import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Comment } from '../../../../core/models/comment.interface';
import { CommentItemComponent } from '../comment-item/comment-item.component';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    CommentItemComponent
  ],
  template: `
    <div class="comments-section">
      <h2 class="comments-title">COMMENTS ({{ totalCount() }})</h2>

      <!-- Add Comment Form -->
      @if (currentUserId()) {
        <form [formGroup]="commentForm" (ngSubmit)="onSubmit()" class="comment-form">
          <div class="form-avatar">
            @if (currentUserAvatar()) {
              <img [src]="getAvatarUrl(currentUserAvatar()!)" alt="Your avatar" />
            } @else {
              <div class="avatar-placeholder">U</div>
            }
          </div>

          <div class="form-content">
            <mat-form-field appearance="outline" class="comment-input">
              <mat-label>ADD A COMMENT</mat-label>
              <textarea
                matInput
                formControlName="content"
                placeholder="Share your thoughts..."
                rows="3"
                maxlength="500"
              ></textarea>
              <mat-hint align="end">
                {{ commentForm.get('content')?.value?.length || 0 }} / 500
              </mat-hint>
            </mat-form-field>

            <div class="form-actions">
              <button
                mat-raised-button
                type="submit"
                class="pixel-btn"
                [disabled]="commentForm.invalid || isSubmitting()"
              >
                @if (isSubmitting()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  POSTING...
                } @else {
                  POST COMMENT
                }
              </button>
            </div>
          </div>
        </form>
      }

      <mat-divider class="comments-divider"></mat-divider>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="comments-loading">
          <mat-spinner diameter="32"></mat-spinner>
          <p>LOADING COMMENTS...</p>
        </div>
      }

      <!-- Empty State -->
      @if (!isLoading() && comments().length === 0) {
        <div class="no-comments">
          <mat-icon>chat_bubble_outline</mat-icon>
          <p>NO COMMENTS YET. BE THE FIRST!</p>
        </div>
      }

      <!-- Comments List -->
      @if (comments().length > 0) {
        <div class="comments-list">
          @for (comment of comments(); track comment.id) {
            <app-comment-item
              [comment]="comment"
              [depth]="0"
              [maxDepth]="3"
              [currentUserId]="currentUserId()"
              [currentUserAvatar]="currentUserAvatar()"
              (likeComment)="likeComment.emit($event)"
              (deleteComment)="deleteComment.emit($event)"
              (replyToComment)="replyToComment.emit($event)"
              (editComment)="editComment.emit($event)"
              (openSidebar)="openSidebar.emit($event)"
            />
          }
        </div>
      }
    </div>

    <!-- Sidebar for Deep Threads -->
    @if (sidebarComment()) {
      <div class="thread-sidebar" (click)="closeSidebar()">
        <div class="sidebar-content" (click)="$event.stopPropagation()">
          <div class="sidebar-header">
            <h3>THREAD</h3>
            <button mat-icon-button (click)="closeSidebar()" class="close-btn">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="sidebar-thread">
            <app-comment-item
              [comment]="sidebarComment()!"
              [depth]="0"
              [maxDepth]="3"
              [currentUserId]="currentUserId()"
              [currentUserAvatar]="currentUserAvatar()"
              (likeComment)="likeComment.emit($event)"
              (deleteComment)="deleteComment.emit($event)"
              (replyToComment)="replyToComment.emit($event)"
              (editComment)="editComment.emit($event)"
              (openSidebar)="onNestedSidebar($event)"
            />
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './comments-section.component.scss'
})
export class CommentsSectionComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly comments = input.required<Comment[]>();
  readonly totalCount = input<number>(0);
  readonly isLoading = input<boolean>(false);
  readonly isSubmitting = input<boolean>(false);
  readonly currentUserId = input<number | null>(null);
  readonly currentUserAvatar = input<string | null>(null);

  // Outputs
  readonly submitComment = output<string>();
  readonly likeComment = output<Comment>();
  readonly deleteComment = output<Comment>();
  readonly replyToComment = output<{ parentId: number; content: string }>();
  readonly editComment = output<{ commentId: number; content: string }>();

  // Sidebar state
  readonly sidebarComment = signal<Comment | null>(null);
  readonly openSidebar = output<Comment>();

  // Form
  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      this.submitComment.emit(this.commentForm.value.content);
      this.commentForm.reset();
    }
  }

  onNestedSidebar(comment: Comment): void {
    // Replace current sidebar with nested comment
    this.sidebarComment.set(comment);
  }

  closeSidebar(): void {
    this.sidebarComment.set(null);
  }

  getAvatarUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/api/images${url}`;
  }
}