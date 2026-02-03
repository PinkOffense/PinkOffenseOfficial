import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { PostService, BlogPost } from '../../services/post.service';

@Component({
  selector: 'app-post',
  imports: [MarkdownComponent, RouterLink],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class Post implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);

  post = signal<BlogPost | null>(null);
  content = signal('');
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.postService.getPost(id).subscribe({
      next: (post) => {
        if (!post) {
          this.error.set(true);
          this.loading.set(false);
          return;
        }
        this.post.set(post);
        this.postService.getPostContent(post.file).subscribe({
          next: (md) => {
            this.content.set(md);
            this.loading.set(false);
          },
          error: () => {
            this.error.set(true);
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
