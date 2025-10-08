import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Post } from '../../../../core/models/post.interface';
import { Comment, CreateCommentRequest } from '../../../../core/models/comment.interface';
// import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-post-detail',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    TimeAgoPipe,
    MarkdownModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly commentService = inject(CommentService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Signals
  readonly post = signal<Post | null>(null);
  readonly comments = signal<Comment[]>([]);
  readonly isLoadingPost = signal(false);
  readonly isLoadingComments = signal(false);
  readonly isSubmittingComment = signal(false);
  readonly error = signal<string | null>(null);

  // Computed
  readonly currentUser = this.authService.currentUser;
  readonly isAuthor = computed(() => {
    const post = this.post();
    const user = this.currentUser();
    return post && user && post.user.id === user.id;
  });

  // Comment form
  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    if (postId) {
      this.loadPost(+postId);
      this.loadComments(+postId);
    }
  }

  loadPost(postId: number): void {
    this.isLoadingPost.set(true);
    this.error.set(null);

    this.postService.getPostById(postId).subscribe({
      next: (response) => {
        if (response) {
          this.post.set(response);
        }
        this.isLoadingPost.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load post');
        this.isLoadingPost.set(false);
        this.snackBar.open('Failed to load post', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    console.log("Loading post with ID:", this.post());
  }

  loadComments(postId: number): void {
    this.isLoadingComments.set(true);

    this.commentService.getCommentsByPost(postId).subscribe({
      next: (response) => {
        if (response) {
          this.comments.set(response);
        }
        this.isLoadingComments.set(false);
      },
      error: (err) => {
        this.isLoadingComments.set(false);
        console.error('Failed to load comments:', err);
      }
    });
  }

  onLikePost(): void {
    const post = this.post();
    if (!post) return;

    const isLiked = post.isLiked || false;
    this.postService.likePost(post.id).subscribe({
      next: () => {
        // Update post locally
        this.post.update(current => {
          if (!current) return current;
          return {
            ...current,
            isLiked: !isLiked,
            likesCount: isLiked ? current.likesCount - 1 : current.likesCount + 1
          };
        });
      },
      error: () => {
        this.snackBar.open('Failed to update like', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const post = this.post();
    if (!post) return;

    this.isSubmittingComment.set(true);

    const request: CreateCommentRequest = {
      content: this.commentForm.value.content,
      postId: post.id
    };

    this.commentService.createComment(post.id,request).subscribe({
      next: (response) => {
        if (response) {
          // Add new comment to list
          this.comments.update(current => [response!, ...current]);
          
          // Update post comment count
          this.post.update(current => {
            if (!current) return current;
            return { ...current, commentsCount: current.commentsCount + 1 };
          });

          // Reset form
          this.commentForm.reset();
          
          this.snackBar.open('Comment added successfully!', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        }
        this.isSubmittingComment.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to add comment', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isSubmittingComment.set(false);
      }
    });
  }

  onEditPost(): void {
    const post = this.post();
    if (!post) return;
    this.router.navigate(['/posts/edit', post.id]);
  }

  onDeletePost(): void {
    const post = this.post();
    if (!post) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Post',
        message: 'Are you sure you want to delete this post? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && post) {
        this.postService.deletePost(post.id).subscribe({
          next: () => {
            this.snackBar.open('Post deleted successfully', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/home']);
          },
          error: () => {
            this.snackBar.open('Failed to delete post', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  onDeleteComment(comment: Comment): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.deleteComment(comment.id).subscribe({
          next: () => {
            // Remove comment from list
            this.comments.update(current => 
              current.filter(c => c.id !== comment.id)
            );

            // Update post comment count
            this.post.update(current => {
              if (!current) return current;
              return { ...current, commentsCount: Math.max(0, current.commentsCount - 1) };
            });

            this.snackBar.open('Comment deleted successfully', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
          },
          error: () => {
            this.snackBar.open('Failed to delete comment', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  isCommentAuthor(comment: Comment): boolean {
    const user = this.currentUser();
    return user ? comment.user.id === user.id : false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  }

  getAuthorInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}