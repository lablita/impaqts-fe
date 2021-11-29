import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[requiredRole]'
})
export class RoleDirective implements OnInit {

  @Input() requiredRole: string[] | null = null;

  constructor(
    private readonly el: ElementRef,
    private readonly userService: UserService
  ) { }
  ngOnInit(): void {
    if (this.requiredRole && this.requiredRole.length > 0) {

      if (this.requiredRole.indexOf(this.userService.getRole()) < 0) {
        this.el.nativeElement.style.display = 'none';
      }

    }
  }

}