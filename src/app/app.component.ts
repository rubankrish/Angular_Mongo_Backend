import { Component } from '@angular/core';
import { Post } from './post/post-list/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedposts: Post[]=[];

  onPostAdded(post){
    this.storedposts.push(post);
  }
}
