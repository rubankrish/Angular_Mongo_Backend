import { Injectable } from '@angular/core';
import { Post } from './post-list/post';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PostsServiceService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient,private router: Router) { }

  getPosts() {
    //return [...this.posts];
    this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformpostdata) => {
        console.log(transformpostdata);
        this.posts = transformpostdata;
        this.postUpdated.next([...this.posts]);
      });

  }
  getPostUpdateListner() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string}>('http://localhost:3000/api/posts/'+id);
  }
  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(response.message);
        post.id = response.postId;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put('http://localhost:3000/api/posts/' + id,post)
    .subscribe(response=>console.log(response));
    this.router.navigate(["/"]);
  }

  deletePost(paramid: string) {
    this.http.delete('http://localhost:3000/api/posts/' + paramid)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== paramid);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }
}
