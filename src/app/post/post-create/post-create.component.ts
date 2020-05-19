import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { Post } from '../post-list/post';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsServiceService } from '../posts-service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredtitle='';
  enteredcontent='';
  newPost ='';
  @Output() postCreated=new EventEmitter<Post>();
  private mode='create';
  private postId: string;
  isLoading =false;
  post: Post;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  constructor(public postsService: PostsServiceService,public route: ActivatedRoute) { }

  onSavePost(){
    //alert('Post Added');
    //this.newPost = this.enteredcontent;
    if (this.form.invalid) {
      return
    }

    //this.postCreated.emit(post);
    if(this.mode==='create'){
      this.isLoading=true;
      this.postsService.addPost(this.form.value.title,this.form.value.content);
      this.form.reset();
    }else{
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content);
      this.form.reset();
    }

  }
  onImagePicked(event: Event){
     const file= (event.target as HTMLInputElement).files[0];
     this.form.patchValue({image:file});
     this.form.get('image').updateValueAndValidity();
     const reader= new FileReader();
     reader.onload=()=>{
       this.imagePreview = reader.result;
     }
     reader.readAsDataURL(file);
  }


  ngOnInit(): void {

    this.form=new FormGroup(
      {
        'title': new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
        'content': new FormControl(null,{validators:[Validators.required]}),
        'image': new FormControl(null,{validators:[Validators.required]})
      }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if (paramMap.has('postId')){
        this.mode ='edit';
        this.postId = paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.postId)
        .subscribe((postData)=>{
            this.post.title=postData._id,
            this.post.title=postData.title,
            this.post.title=postData.content
            this.form.setValue({
              title: postData.title,
              content: postData.content
            });
        });
        this.isLoading=false;
      }else{
        this.mode='create';
        this.postId=null;
      }
    })
  };

}
