import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MarkdownModule } from 'ngx-markdown';

import { PostService } from '../../services/post.service';

@Component({
	selector: 'app-post-create',
	imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MarkdownModule],
	templateUrl: './post-create.component.html',
	styleUrl: './post-create.component.scss',
})
export class PostCreateComponent {
	postForm: FormGroup;
	isUploading = false;

	constructor(private fb: FormBuilder, private postService: PostService) {
		this.postForm = this.fb.group({
			content: ['', Validators.required],
			title: ['', Validators.required]
		})
	}

	onSubmit() {
		this.postForm.markAllAsTouched();

		if (this.postForm.valid) {
			this.postService.savePost(this.postForm.value).subscribe({
				next: (res) => {
					console.log("ok")
				},
				error: (err) => {
					console.log(err)
				}
			})

		}
	}


	async onPaste(event: ClipboardEvent) {
		const clipboardData = event.clipboardData;


		const pastedText = clipboardData?.getData('text/plain');
		if (pastedText) {
			try {
				const url = new URL(pastedText)
				if (this.isImage(url.pathname)) {
					event.preventDefault()
					this.insertMarkdownImage(pastedText);
				} else if (this.isVideo(url.pathname)) {
					event.preventDefault()
					this.insertMarkdownVideo(pastedText);
				}
			} catch {
				return
			}

		} else {
			if (clipboardData?.items) {
				for (const item of clipboardData?.items) {
					if (item.kind == 'file') {
						event.preventDefault()
						const file = item.getAsFile();
						if (file) {
							document.execCommand("insertText", false, `![Uploading image](...)`)
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
				document.execCommand("insertText", false, `![Uploading image](...)`)
				await this.handleFileUpload(file);
			}
		}

	}




	async handleFileUpload(file: File): Promise<void> {
		this.isUploading = true;

		try {
			const uploadedUrl = await this.postService.uploadFile(file).toPromise();
			if (uploadedUrl) {
				let content = this.postForm.value?.content
				if (file.type.startsWith('image/')) {
					if (content
						.includes("![Uploading image](...)")) {
						this.postForm.patchValue({
							content: content.replace("![Uploading image](...)", this.MarkdownImage(uploadedUrl.url))
						})
					} else {
						this.insertMarkdownImage(uploadedUrl.url)
					}
				} else if (file.type.startsWith('video/')) {
					if (content.includes("![Uploading video](...)")) {
						this.postForm.patchValue({
							content: content.replace("![Uploading video](...)", this.MarkdownVideo(uploadedUrl.url))
						})
					} else {
						this.insertMarkdownVideo(uploadedUrl.url)
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