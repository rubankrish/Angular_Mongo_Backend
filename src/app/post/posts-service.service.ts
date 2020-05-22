import { Injectable } from '@angular/core';
import { Post } from './post-list/post';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
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
            id: post._id,
            imagePath: post.imagePath
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
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/'+id);
  }
  addPost(title: string, content: string,image: File) {
    const postData = new FormData();
    postData.append('title',title);
    postData.append('content',content);
    postData.append('image',image,title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post ={id: responseData.post.id,title: title,content: content,imagePath: null}
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }

  updatePost(id: string, title: string, content: string,image: string | File) {
    let postData: Post | FormData;
    if(typeof(image)==='object'){
      postData= new FormData();
      postData.append("id",id);
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image,title);
    }else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id,postData)
    .subscribe(responseData=>{
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p=> p.id===id);
      const post: Post = { id: id, title: title, content: content , imagePath: ""};
      //this.postUpdated.next([...updatedPosts]);
    });
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
