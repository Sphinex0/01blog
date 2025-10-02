import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-create',
  imports: [
    NgxEditorComponent,
    NgxEditorMenuComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatError,
  ],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss',
})
export class PostCreateComponent {
  editor: Editor = new Editor();
  // private readonly postService = inject(PostService);

  html: '' = '';
  form: FormGroup;
  constructor(private fb: FormBuilder,private readonly postService:PostService) {
    this.form = this.fb.group({
      html: ['', Validators.required],
    });
  }

  onSubmit(): void {
    console.log('submittttttted ');
    let str = this.form.value.html;
    this.form.setValue({ html: str.replaceAll(/<[^>]*>*<\/[^>]*>/g, '') });
    this.form.setValue({ html: str.replaceAll(/<[^>]*>*<\/[^>]*>/g, '') });
    if (this.form.valid) {
      // const { registerData } = this.loginForm.value;
      console.log(this.form.get('html')?.value);
      this.postService.savePost({content:this.form.get('html')?.value});
      // const request: LoginRequest = this.loginForm.value;

      // this.authService.login(request).subscribe({
      //   next: (response) => {
      //     if (response) {
      //       this.snackBar.open('Login successful! Welcome to 01Blog!', 'Close', {
      //         duration: 5000,
      //         panelClass: ['success-snackbar']
      //       });
      //     }
      //   },
      //   error: (error) => {
      //     const message = error.error?.message || 'Login failed. Please try again.';
      //     this.snackBar.open(message, 'Close', {
      //       duration: 5000,
      //       panelClass: ['error-snackbar']
      //     });
      //   }
      // });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
