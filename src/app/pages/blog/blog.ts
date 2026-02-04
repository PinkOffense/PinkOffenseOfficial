import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService, BlogPost } from '../../services/post.service';

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
  private postService = inject(PostService);

  activeCategory = signal('all');
  posts = signal<BlogPost[]>([]);
  loading = signal(true);

  categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'technical-analysis', name: 'Technical Analysis' },
    { id: 'research', name: 'Research' },
    { id: 'methodology', name: 'Methodology' },
    { id: 'industry', name: 'Industry Insights' }
  ];

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  get filteredPosts(): BlogPost[] {
    if (this.activeCategory() === 'all') {
      return this.posts();
    }
    return this.posts().filter(p => p.category === this.activeCategory());
  }

  get featuredPosts(): BlogPost[] {
    return this.posts().filter(p => p.featured);
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
