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
  template: `
    <div class="comment-item" [class.nested]="depth() > 0" [style.--depth]="depth()">
      <div class="comment-main">
        <!-- Avatar -->
        <a [routerLink]="['/users/profile', comment().user.username]" class="comment-avatar">
          @if (comment().user.avatar) {
            <img [src]="getAvatarUrl(comment().user.avatar!)" [alt]="comment().user.fullName" />
          } @else {
            <div class="avatar-placeholder">
              {{ getInitials(comment().user.fullName) }}
            </div>
          }
        </a>

        <!-- Content -->
        <div class="comment-content">
          <div class="comment-header">
            <div class="comment-author-info">
              <a [routerLink]="['/users/profile', comment().user.username]" class="comment-author-name">
                {{ comment().user.fullName }}
              </a>
              <span class="comment-time">{{ comment().createdAt | timeAgo }}</span>
            </div>

            <!-- Menu -->
            @if (isAuthor()) {
              <button mat-icon-button [matMenuTriggerFor]="menu" class="comment-menu-btn">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="onEdit()">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteComment.emit(comment())" class="delete-btn">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            }
          </div>

          <!-- Comment Text or Edit Form -->
          @if (!isEditing()) {
            <p class="comment-text">{{ comment().content }}</p>
          } @else {
            <form [formGroup]="editForm" (ngSubmit)="onSaveEdit()" class="edit-form">
              <mat-form-field appearance="outline" class="edit-input">
                <textarea
                  matInput
                  formControlName="content"
                  rows="3"
                  maxlength="500"
                ></textarea>
              </mat-form-field>
              <div class="edit-actions">
                <button type="button" mat-button (click)="onCancelEdit()" class="pixel-btn-secondary">
                  CANCEL
                </button>
                <button type="submit" mat-raised-button class="pixel-btn" [disabled]="editForm.invalid">
                  SAVE
                </button>
              </div>
            </form>
          }

          <!-- Actions -->
          <div class="comment-actions">
            <button class="action-btn" (click)="onLike()" [class.liked]="comment().isLiked">
              <mat-icon>{{ comment().isLiked ? 'favorite' : 'favorite_border' }}</mat-icon>
              @if (comment().likesCount && comment().likesCount > 0) {
                <span>{{ comment().likesCount }}</span>
              }
            </button>

            @if (depth() < maxDepth()) {
              <button class="action-btn" (click)="toggleReply()">
                <mat-icon>reply</mat-icon>
                <span>REPLY</span>
              </button>
            }

            @if (comment().repliesCount && comment().repliesCount > 0) {
              <button class="action-btn" (click)="toggleReplies()">
                <mat-icon>{{ showReplies() ? 'expand_less' : 'expand_more' }}</mat-icon>
                <span>{{ comment().repliesCount }} {{ comment().repliesCount === 1 ? 'REPLY' : 'REPLIES' }}</span>
              </button>
            }
          </div>

          <!-- Reply Form -->
          @if (showReplyForm()) {
            <form [formGroup]="replyForm" (ngSubmit)="onSubmitReply()" class="reply-form">
              <div class="form-avatar">
                @if (currentUserAvatar()) {
                  <img [src]="getAvatarUrl(currentUserAvatar()!)" alt="Your avatar" />
                } @else {
                  <div class="avatar-placeholder">U</div>
                }
              </div>
              <div class="form-content">
                <mat-form-field appearance="outline" class="reply-input">
                  <textarea
                    matInput
                    formControlName="content"
                    placeholder="Write a reply..."
                    rows="2"
                    maxlength="500"
                  ></textarea>
                </mat-form-field>
                <div class="form-actions">
                  <button type="button" mat-button (click)="toggleReply()" class="pixel-btn-secondary">
                    CANCEL
                  </button>
                  <button type="submit" mat-raised-button class="pixel-btn" [disabled]="replyForm.invalid">
                    REPLY
                  </button>
                </div>
              </div>
            </form>
          }
        </div>
      </div>

      <!-- Nested Replies -->
      @if (showReplies() && comment().replies && comment().replies!.length > 0) {
        <div class="replies-container">
          @for (reply of visibleReplies(); track reply.id) {
            <app-comment-item
              [comment]="reply"
              [depth]="depth() + 1"
              [maxDepth]="maxDepth()"
              [currentUserId]="currentUserId()"
              [currentUserAvatar]="currentUserAvatar()"
              (likeComment)="likeComment.emit($event)"
              (deleteComment)="deleteComment.emit($event)"
              (replyToComment)="replyToComment.emit($event)"
              (editComment)="editComment.emit($event)"
              (openSidebar)="openSidebar.emit($event)"
            />
          }

          <!-- Show More Button or Open Sidebar -->
          @if (hasMoreReplies()) {
            @if (depth() + 1 < maxDepth()) {
              <button class="show-more-btn pixel-btn-secondary" (click)="loadMoreReplies()">
                <mat-icon>expand_more</mat-icon>
                SHOW MORE REPLIES
              </button>
            } @else {
              <button class="open-sidebar-btn pixel-btn" (click)="onOpenSidebar()">
                <mat-icon>forum</mat-icon>
                CONTINUE THREAD →
              </button>
            }
          }
        </div>
      }
    </div>
  `,
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
    this.visibleRepliesCount.update(v => v + 3);
  }

  onOpenSidebar(): void {
    // Find the third-level reply to continue from
    const replies = this.comment().replies || [];
    if (replies.length > 0) {
      this.openSidebar.emit(replies[0]);
    }
  }

  getAvatarUrl(url: string): string {
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}
