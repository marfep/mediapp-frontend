import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';
import { PasswordValidation } from './match';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: FormGroup;
  token: string;
  message: string;
  error: string;
  rpta: number;
  validToken: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loginService : LoginService
  ) { }


  ngOnInit() {
    this.form = this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.route.params.subscribe((params : Params) => {
      this.token = params['token'];
      this.loginService.checkTokenReset(this.token).subscribe(data => {
      
        if(data === 1){
          this.validToken = true;
        }else{
          this.validToken = false;
          setTimeout( () => {
            this.router.navigate(['login']);
          }, 2000)
        }
      });
    })
  }

  onSubmit(){
    let clave: string = this.form.value.confirmPassword;
    this.loginService.reset(this.token, clave).subscribe(data => {
      this.message = 'Password has been change';

        setTimeout(() => {          
          this.router.navigate(['login']);
        }, 2000);
    });
  }


}
