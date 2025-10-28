import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MarkdownModule } from 'ngx-markdown';

import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../../core/models/post.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MarkdownModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly isLoadingPost = signal(false);
  readonly post = signal<Post | null>(null);
  private readonly snackBar = inject(MatSnackBar);
  readonly error = signal<string | null>(null);

  // NEW: State for deferred uploads
  isSaving = false;
  private pendingFiles = new Map<string, File>();

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      content: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    if (postId) {
      this.loadPost(+postId);
    }
  }

  // NEW: Clean up blob URLs on component destruction to prevent memory leaks
  ngOnDestroy(): void {
    for (const url of this.pendingFiles.keys()) {
      URL.revokeObjectURL(url);
    }
  }

  loadPost(postId: number): void {
    this.isLoadingPost.set(true);
    this.postService.getPostById(postId).subscribe({
      next: (response) => {
        if (response) {
          this.post.set(response);
          this.postForm.setValue({
            title: response.title,
            content: response.content,
          });
        }
        this.isLoadingPost.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load post');
        this.isLoadingPost.set(false);
        this.snackBar.open('Failed to load post', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  toolBarClick(textarea: HTMLTextAreaElement, start: string, end: string) {
    textarea.focus();
    document.execCommand('insertText', false, `${start}${window.getSelection()?.toString()}${end}`);
    this.postForm.get('content')?.setValue(textarea.value);
  }

  // --- REVISED FILE HANDLING LOGIC ---

  private handleFileSelection(file: File): void {
    if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
        return;
    }
    // Create a temporary local "blob" URL for the file for previewing
    const localUrl = URL.createObjectURL(file);
    // Add the file to our pending map, keyed by its local URL
    this.pendingFiles.set(localUrl, file);
    // Insert markdown for the preview using the local URL
    if (file.type.startsWith('image/')) {
        this.insertMarkdownImage(localUrl);
    } else if (file.type.startsWith('video/')) {
        this.insertMarkdownVideo(localUrl);
    }
  }

  onImageUpload(event: Event, textarea: HTMLTextAreaElement) {
    textarea.focus();
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (const file of Array.from(files)) {
        this.handleFileSelection(file);
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text/plain');

    if (pastedText) {
      // Keep existing logic for pasting external URLs
      try {
        const url = new URL(pastedText);
        if (this.isImage(url.pathname)) {
          event.preventDefault();
          this.insertMarkdownImage(pastedText);
        } else if (this.isVideo(url.pathname)) {
          event.preventDefault();
          this.insertMarkdownVideo(pastedText);
        }
      } catch {
        return;
      }
    } else if (clipboardData?.items) {
      // Handle pasted files
      for (const item of Array.from(clipboardData.items)) {
        if (item.kind === 'file') {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            this.handleFileSelection(file);
          }
        }
      }
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (const file of Array.from(files)) {
        this.handleFileSelection(file);
      }
    }
  }

  // --- REVISED SUBMIT LOGIC ---

  async onSubmit() {
    this.postForm.markAllAsTouched();
    if (this.postForm.invalid || this.isSaving) {
      return;
    }

    this.isSaving = true;
    try {
      let content = this.postForm.get('content')?.value || '';

      // Step 1: Upload all pending files
      if (this.pendingFiles.size > 0) {
        const uploadPromises = Array.from(this.pendingFiles.entries()).filter(([localUrl, file]) => {
          // Only include files that are images or videos
          return content.includes(localUrl) && (this.isImage(file.name) || this.isVideo(file.name));
        }).map(
          ([localUrl, file]) =>
            this.postService.uploadFile(file).toPromise().then(response => {
                // IMPORTANT: Revoke the local URL to free up memory
                URL.revokeObjectURL(localUrl);
                return { localUrl, remoteUrl: response?.url };
            })
        );
        const uploadedFiles = await Promise.all(uploadPromises);

        // Step 2: Replace local preview URLs with final remote URLs in the content
        for (const { localUrl, remoteUrl } of uploadedFiles) {
          content = content.replaceAll(localUrl, remoteUrl);
        }

        this.postForm.patchValue({ content });
        this.pendingFiles.clear();
      }

      // Step 3: Save or update the post with final content
      const postData = this.postForm.value;
      const currentPost = this.post();
      const saveOrUpdate$ = currentPost
        ? this.postService.updatePost(currentPost.id, postData)
        : this.postService.savePost(postData);

      const savedpost = await saveOrUpdate$.toPromise();
      this.snackBar.open('Post saved successfully!', 'Close', { duration: 3000 });
      this.router.navigate(["posts", savedpost?.id])

    } catch (error) {
      console.error('Failed to save post:', error);
      this.snackBar.open('An error occurred while saving.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.isSaving = false;
      this.postForm.reset();
    }
  }

  // --- HELPER FUNCTIONS ---

  getExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  isImage(filename: string): boolean {
    return imageExtensions.has(this.getExtension(filename));
  }

  isVideo(filename: string): boolean {
    return videoExtensions.has(this.getExtension(filename));
  }

  insertMarkdownImage(url: string): void {
    const markdown = `![image](${url})`;
    this.insertText(markdown);
  }

  insertMarkdownVideo(url: string): void {
    const markdown = `<video controls><source src="${url}" ></video>`;
    this.insertText(markdown);
  }

  insertText(pastedText: string) {
    document.execCommand('insertText', false, pastedText);
  }
}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);