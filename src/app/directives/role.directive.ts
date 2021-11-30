import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { EmitterService } from '../utils/emitter.service';

@Directive({
  selector: '[requiredRole]'
})
export class RoleDirective implements OnInit {

  @Input() requiredRole: string[] | null = null;
  private role: string = '';

  constructor(
    private readonly el: ElementRef,
    private readonly userService: UserService,
    private readonly emitterService: EmitterService
  ) {
    // this.emitterService.user.subscribe(user => {
    //   if (!!user.role) {
    //     this.role = user.role
    //     this.init();
    //   }
    // })
  }

  ngOnInit(): void {
    this.role = this.userService.getRole();
    this.init();
  }

  private init(): void {
    if (this.requiredRole && this.requiredRole.length > 0 && this.requiredRole.indexOf(this.role) < 0) {
      this.el.nativeElement.style.display = 'none';
    }
  }

}