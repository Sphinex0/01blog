import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Comment } from '../../../../core/models/comment.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    TimeAgoPipe
  ],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss'
})
export class CommentItemComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly comment = input.required<Comment>();
  readonly depth = input<number>(0);
  readonly maxDepth = input<number>(3);
  readonly currentUserId = input<number | null>(null);
  readonly currentUserAvatar = input<string | null>(null);

  // Outputs
  readonly likeComment = output<Comment>();
  readonly getReplies = output<Comment>();
  readonly deleteComment = output<Comment>();
  readonly replyToComment = output<{ parentId: number; content: string }>();
  readonly editComment = output<{ commentId: number; content: string }>();
  readonly openSidebar = output<Comment>();

  // State
  readonly showReplyForm = signal(false);
  readonly showReplies = signal(false);
  readonly isEditing = signal(false);
  readonly visibleRepliesCount = signal(3);

  // Computed
  readonly isAuthor = computed(() => 
    this.currentUserId() === this.comment().user.id
  );

  readonly visibleReplies = computed(() => {
    const replies = this.comment().replies || [];
    return replies.slice(0, this.visibleRepliesCount());
  });

  readonly hasMoreReplies = computed(() => {
    const replies = this.comment().replies || [];
    return replies.length > this.visibleRepliesCount();
  });

  // Forms
  replyForm: FormGroup;
  editForm: FormGroup;

  constructor() {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.editForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  toggleReply(): void {
    this.showReplyForm.update(v => !v);
    if (!this.showReplyForm()) {
      this.replyForm.reset();
    }
  }

  toggleReplies(): void {
    console.log("Current depth:", this.depth());

    if ( this.depth() >= this.maxDepth() ){
      this.onOpenSidebar();
      return;
    };
 
    this.getReplies.emit(this.comment());
    this.showReplies.update(v => !v);
  }

  onSubmitReply(): void {
    if (this.replyForm.valid) {
      this.replyToComment.emit({
        parentId: this.comment().id,
        content: this.replyForm.value.content
      });
      this.replyForm.reset();
      this.showReplyForm.set(false);
      this.showReplies.set(true);
    }
  }

  onLike(): void {
    this.likeComment.emit(this.comment());
    // console.log('Liking comment ID:', this.comment().isLiked);
  }

  onEdit(): void {
    this.editForm.patchValue({ content: this.comment().content });
    this.isEditing.set(true);
  }

  onSaveEdit(): void {
    if (this.editForm.valid) {
      this.editComment.emit({
        commentId: this.comment().id,
        content: this.editForm.value.content
      });
      this.isEditing.set(false);
    }
  }

  onCancelEdit(): void {
    this.isEditing.set(false);
    this.editForm.reset();
  }

  loadMoreReplies(): void {
    let c = this.comment();
    console.log('out:');
    if (c.replies && c.replies.length - this.visibleRepliesCount() < 3) {
      console.log('in:');
      this.getReplies.emit(c);
    }
    this.visibleRepliesCount.update(v => v + 3);
  }

  onOpenSidebar(): void {
    console.log('Opening sidebar for comment ID:', this.comment().id);
    // Find the third-level reply to continue from
    const replies = this.comment().replies || [];
    // if (replies.length > 0) {
      // this.openSidebar.emit(replies[0]);
      this.openSidebar.emit(this.comment());
    // }
  }

  getAvatarUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/api/${url}`;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}
