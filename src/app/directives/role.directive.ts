import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '../model/user';

@Directive({
  selector: '[requiredRole]'
})
export class RoleDirective implements OnInit {

  @Input() requiredRole: string[] | null = null;
  private role: string = '';
  public user: User = new User();

  constructor(
    private readonly el: ElementRef,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(u => {
      this.role = !!u ? u['https://impaqts.eu.auth0.meta/role'] : '';
      this.init();
    })
  }

  private init(): void {
    if (this.requiredRole && this.requiredRole.length > 0 && this.requiredRole.indexOf(this.role) < 0) {
      this.el.nativeElement.style.display = 'none';
    }
  }

}