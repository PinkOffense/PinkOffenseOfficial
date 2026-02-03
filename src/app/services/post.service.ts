import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  file: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private basePath = 'assets/posts';

  private posts$: Observable<BlogPost[]> | null = null;

  getPosts(): Observable<BlogPost[]> {
    if (!this.posts$) {
      this.posts$ = this.http
        .get<BlogPost[]>(`${this.basePath}/posts.json`)
        .pipe(
          map(posts => posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())),
          shareReplay(1)
        );
    }
    return this.posts$;
  }

  getPost(id: string): Observable<BlogPost | undefined> {
    return this.getPosts().pipe(
      map(posts => posts.find(p => p.id === id))
    );
  }

  getPostContent(file: string): Observable<string> {
    return this.http.get(`${this.basePath}/${file}`, { responseType: 'text' });
  }
}
