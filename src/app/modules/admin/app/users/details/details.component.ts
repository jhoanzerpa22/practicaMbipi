import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { RolService } from '../roles.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector       : 'users-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetailsComponent implements OnInit, OnDestroy
{
    signUpForm: FormGroup;
    @ViewChild('courseSteps', {static: true}) courseSteps: MatTabGroup;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    roles: any = [];
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    id: any = '';
    user: any = [];

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _usersService: UsersService,
        private rolService: RolService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _router: Router,
        private route: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getRoles();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            /*this.route.queryParams
                .subscribe((params: any) => {

                    this.id = params.id;
                    
                    this.getUser(params.id);
                }
                );*/
                this.route.params.subscribe(params => {
                      this.id = params['id'];
                      if(this.id > 0){
                        this.signUpForm = this._formBuilder.group({
                            nombre      : ['', Validators.required],
                            rut      : ['', Validators.required],
                            correo_login    : ['', [Validators.required, Validators.email]],
                            fono   : [''],
                            roles: ['', [Validators.required]]
                        }
                        );
                        this.getUser(params['id']);
                      }else{
                        this.signUpForm = this._formBuilder.group({
                            nombre      : ['', Validators.required],
                            rut      : ['', Validators.required],
                            correo_login    : ['', [Validators.required, Validators.email]],
                            password  : ['', Validators.required],
                            conf_password  : ['', Validators.required],
                            fono   : [''],
                            roles: ['', [Validators.required]]
                        }
                        );
                      }
                      
                });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    
    getRoles(): void {
        this.rolService.getAll()
          .subscribe(
            data => {
              this.roles = data;
             // console.log(data);
            },
            error => {
              console.log(error);
            });
      }

      getUser(id: any): void {
        this._usersService.get(id)
          .subscribe(
            data => {
              this.user = data;
              console.log(data);
              this.setValueEdit(data);
            },
            error => {
              console.log(error);
            });
      }

      setValueEdit(data: any){
        this.signUpForm.setValue({
            'nombre'          : data.nombre,
            'rut'      : data.rut,
            'correo_login'      : data.user.correo_login,
            'fono'      : data.fono,
            'roles': data.user.roles.length > 0 ? data.user.roles[0].id : '',
        });
    }

    
    /**
     * Sign up
     */
     signUp(): void
     {
         // Do nothing if the form is invalid
         if ( this.signUpForm.invalid )
         {
             return;
         }
 
         // Disable the form
         this.signUpForm.disable();

         const val = this.signUpForm.value;

    if(this.id){
        const data_general2:any = {
            'nombre'          : val.nombre,
            'rut'      : val.rut,
            'correo_login' : val.correo_login.toLowerCase(),
            'fono'   : val.fono,
            'roles'   : val.roles
          }
    	this._usersService.update(this.id, data_general2)
        .subscribe(
            (response) => {

                // Navigate to the confirmation required page
                this._router.navigateByUrl('/users');
            },
            (response) => {

                // Re-enable the form
                this.signUpForm.enable();

                // Reset the form
                //this.signUpNgForm.resetForm();
            }
        );

    }else{

        if(val.password != val.conf_password){
            // Set the alert
            this.alert = {
              type   : 'error',
              message: 'La nueva clave no coincide con la confirmación.'
              };
      
              // Show the alert
              this.showAlert = true;
          }else{
            const data_general:any = {
                'nombre'          : val.nombre,
                'rut'      : val.rut,
                'correo_login' : val.correo_login.toLowerCase(),
                'password' : val.password,
                'fono'   : val.fono,
                'roles'   : val.roles
              }

            this._usersService.create(data_general)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/users');
                },
                (response) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    //this.signUpNgForm.resetForm();
                }
            );
          }
        }
        
     }

    /**
     * Go to given step
     *
     * @param step
     */
    goToStep(step: number): void
    {
        // Set the current step
        this.currentStep = step;

        // Go to the step
        this.courseSteps.selectedIndex = this.currentStep;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Go to previous step
     */
    goToPreviousStep(): void
    {
        // Return if we already on the first step
        if ( this.currentStep === 0 )
        {
            return;
        }

        // Go to step
        this.goToStep(this.currentStep - 1);

        // Scroll the current step selector from sidenav into view
        this._scrollCurrentStepElementIntoView();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Scrolls the current step element from
     * sidenav into the view. This only happens when
     * previous/next buttons pressed as we don't want
     * to change the scroll position of the sidebar
     * when the user actually clicks around the sidebar.
     *
     * @private
     */
    private _scrollCurrentStepElementIntoView(): void
    {
        // Wrap everything into setTimeout so we can make sure that the 'current-step' class points to correct element
        setTimeout(() => {

            // Get the current step element and scroll it into view
            const currentStepElement = this._document.getElementsByClassName('current-step')[0];
            if ( currentStepElement )
            {
                currentStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block   : 'start'
                });
            }
        });
    }
}
