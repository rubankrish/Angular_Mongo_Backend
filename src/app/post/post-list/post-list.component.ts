import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './post';
import { PostsServiceService } from '../posts-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  public posts: Post[] = [];
  private postsSub: Subscription;
  isLoading: boolean=false;
  constructor(public postService: PostsServiceService) { }

  ngOnInit() {
    this.isLoading=true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListner()
      .subscribe(
        (post: Post[]) => {
          this.posts = post;
          this.isLoading=false;
          //console.log(this.posts);
        });

  }
  onDelete(postId: string){
    this.postService.deletePost(postId);
  }
  ngOnDestory() {
    this.postsSub.unsubscribe();
  }

}
