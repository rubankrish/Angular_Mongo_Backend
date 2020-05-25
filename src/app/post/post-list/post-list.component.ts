import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './post';
import { PostsServiceService } from '../posts-service.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  public posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 5;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostsServiceService) { }

  ngOnInit() {
    this.isLoading=true;
    this.postService.getPosts(this.postsPerPage,1);
    this.postsSub = this.postService.getPostUpdateListner()
      .subscribe(
        (post: Post[]) => {
          this.posts = post;
          this.isLoading=false;
          //console.log(this.posts);
        });
  }

  onChangedPage(pageData: PageEvent){
      //this.isLoading=true;
      this.currentPage = pageData.pageIndex+1;
      this.postsPerPage = pageData.pageSize;
      console.log(this.currentPage);
      this.postService.getPosts(this.postsPerPage,this.currentPage);
  };
  onDelete(postId: string){
    this.postService.deletePost(postId);
  }
  ngOnDestory() {
    this.postsSub.unsubscribe();
  }

}
