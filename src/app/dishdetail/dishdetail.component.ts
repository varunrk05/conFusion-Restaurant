import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from '../shared/comment';

import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  comment: Comment;
  //@ViewChild('cform') feedbackFormDirective;

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id)});
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() : void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: '',
      rating: 5,
      comment: ''
    });

    // this.commentForm.valueChanges
    //   .subscribe(data => this.onValueChanged(data));

    // this.onValueChanged();
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    //this.feedBackFormDirective.resetForm();
  }
}
