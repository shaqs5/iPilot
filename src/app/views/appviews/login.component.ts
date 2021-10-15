import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: 'login.template.html'
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const val = this.form.value;
    // let loginData = { 'email': val.email, 'password': val.password }
    // console.log('LOGIN-LINE-27', loginData)
    if (val.email && val.password) {
      this.authService.loginUser(val.email, val.password)
    }
  }

  ngOnInit() {
  }

}
