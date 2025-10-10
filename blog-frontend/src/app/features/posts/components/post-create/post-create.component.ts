import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../../core/models/post.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-create',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MarkdownModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  private readonly route = inject(ActivatedRoute);
  readonly isLoadingPost = signal(false);
  readonly post = signal<Post | null>(null);
  private readonly snackBar = inject(MatSnackBar);
  readonly error = signal<string | null>(null);

  isUploading = false;

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
      // this.loadComments(+postId);
    }
  }

  loadPost(postId: number): void {
    this.isLoadingPost.set(true);
    // this.error.set(null);

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

    console.log('Loading post with ID:', this.post());
  }

  toolBarClick(textarea: HTMLTextAreaElement, start: string, end: string) {
    console.log(start);
    textarea.focus();
    // this.insertText(`${start}${window}${end}`)
    document.execCommand('insertText', false, `${start}${window.getSelection()?.toString()}${end}`);
    this.postForm.get('description')?.setValue(textarea.value);
  }

  async onImageUpload(event: Event, textarea: HTMLTextAreaElement) {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
      for (const file of files) {
        textarea.focus();
        await this.handleFileUpload(file);
      }
    }
  }

  onSubmit() {
    this.postForm.markAllAsTouched();

    if (this.postForm.valid) {
      let p = this.post();
      if (p) {
        this.postService.updatePost(p.id, this.postForm.value).subscribe({
          next: (res) => {
            console.log('ok');
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.postService.savePost(this.postForm.value).subscribe({
          next: (res) => {
            console.log('ok');
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }

  async onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;

    const pastedText = clipboardData?.getData('text/plain');
    if (pastedText) {
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
    } else {
      if (clipboardData?.items) {
        for (const item of clipboardData?.items) {
          if (item.kind == 'file') {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              document.execCommand('insertText', false, `![Uploading image](...)`);
              await this.handleFileUpload(file);
            }
          }
        }
      }
    }
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (const file of files) {
        document.execCommand('insertText', false, `![Uploading image](...)`);
        await this.handleFileUpload(file);
      }
    }
  }

  async handleFileUpload(file: File): Promise<void> {
    this.isUploading = true;

    try {
      const uploadedUrl = await this.postService.uploadFile(file).toPromise();
      if (uploadedUrl) {
        let content = this.postForm.value?.content;
        if (file.type.startsWith('image/')) {
          if (content.includes('![Uploading image](...)')) {
            this.postForm.patchValue({
              content: content.replace(
                '![Uploading image](...)',
                this.MarkdownImage(uploadedUrl.url)
              ),
            });
          } else {
            this.insertMarkdownImage(uploadedUrl.url);
          }
        } else if (file.type.startsWith('video/')) {
          if (content.includes('![Uploading video](...)')) {
            this.postForm.patchValue({
              content: content.replace(
                '![Uploading video](...)',
                this.MarkdownVideo(uploadedUrl.url)
              ),
            });
          } else {
            this.insertMarkdownVideo(uploadedUrl.url);
          }
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      this.isUploading = false;
    }
  }

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

  MarkdownVideo(url: string): string {
    return `<video controls><source src="${url}" ></video>`;
  }

  MarkdownImage(url: string): string {
    return `![image](${url})`;
  }

  insertText(pastedText: string) {
    document.execCommand('insertText', false, pastedText);
  }
}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);
