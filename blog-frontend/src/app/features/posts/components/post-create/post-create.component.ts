import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MarkdownModule } from 'ngx-markdown';
import { PostService } from '../../services/post.service';


@Component({
	selector: 'app-create-blog',
	imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MarkdownModule],
	templateUrl: './post-create.component.html',
	styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {
	markdown = ``;
	formBlog: FormGroup;
	previewUrl = "";
	isUploading = false;

	constructor(private fb: FormBuilder, private blogService: PostService) {
		this.formBlog = this.fb.group({
			description: ['', Validators.required],
			title: ['', Validators.required]
		})
	}

	onSubmit() {
		this.formBlog.markAllAsTouched();

		if (this.formBlog.valid) {
			console.log('data', this.formBlog.value.description)
			this.blogService.savePost(this.formBlog.value).subscribe({
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
					console.log(item)
					if (item.kind == 'file') {
						event.preventDefault()
						const file = item.getAsFile();
						if (file) {
							console.log(file.type)
							let previewUrl = URL.createObjectURL(file)
							this.insertMarkdownImage(previewUrl);
							await this.handleFileUpload(file);
						}
					}
				}
			}
		}

	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		const files = event.dataTransfer?.files;
		console.log(files)
		if (files) {
			for (const file of files) {
				let previewUrl = URL.createObjectURL(file)
				document.execCommand('insertText', false, `![image](${previewUrl})`);
			}
		}

	}




	async handleFileUpload(file: File): Promise<void> {
		this.isUploading = true;

		try {
			const uploadedUrl = null //await this.blogService.uploadFile(file).toPromise();
			if (uploadedUrl) {
				if (file.type.startsWith('image/')) {
					// this.insertMarkdownImage(uploadedUrl.url);
				} else if (file.type.startsWith('video/')) {
					// this.insertMarkdownVideo(uploadedUrl.url);
				}
			}



		} catch (error) {
			console.error('Upload failed:', error);
			alert('File upload failed. Please try again.');
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

	insertText(pastedText: string) {
		document.execCommand('insertText', false, pastedText);
	}

}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg']);
const videoExtensions = new Set(['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v']);