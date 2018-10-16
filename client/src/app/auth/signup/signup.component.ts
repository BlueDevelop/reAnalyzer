import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { first } from 'rxjs/operators';
import { UserService } from '../../_services/user.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,private router:Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      uniqueId: new FormControl('',{validators: [Validators.required, Validators.email ]}),
      password: new FormControl('',{validators:[Validators.required, Validators.minLength(6)]}),
      name: new FormControl('',{validators:[Validators.required]})
      
    })
  }
  
  onSubmit() {

    // stop here if form is invalid
    if (this.signupForm.invalid) {
        return;
    }

    this.loading = true;
    this.userService.register(this.signupForm.value)
        .pipe(first())
        .subscribe(
            data => {
              console.dir(data);
                this.router.navigate(['/login']);
            },
            error => {
                this.loading = false;
            });
}
}
