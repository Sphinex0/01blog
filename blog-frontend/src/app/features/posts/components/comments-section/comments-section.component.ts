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
  templateUrl: './comments-section.component.html',
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
  readonly getReplies = output<Comment>();
  readonly getComments = output<Comment>();
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
  onTriggerVisible(): void {
    if (!this.isLoading() && this.comments().length < this.totalCount()) {
      const lastComment = this.comments()[this.comments().length - 1];
      this.getComments.emit(lastComment);
    }
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
    return `http://localhost:8080/api/${url}`;
  }
}