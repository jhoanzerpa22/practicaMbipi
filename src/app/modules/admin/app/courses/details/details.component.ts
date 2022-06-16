import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { CoursesService } from '../courses.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'courses-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesDetailsComponent implements OnInit, OnDestroy
{
    horizontalStepperForm: FormGroup;
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
    course: any = [];
    lessons: any = [];
    lecciones: any = [];        
    showLessons: boolean = false;

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _coursesService: CoursesService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService,
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

                        /*this.lecciones = [
                            {
                                id          : 'cd5fa417-b667-482d-b208-798d9da3213c',
                                nombre        : 'Lesson 51',
                                subtitulo      : '',
                                orden       : 1,
                                url     : 'http://youtube.com'
                            }];*/
                       
                        this.horizontalStepperForm = this._formBuilder.group({
                            step1: this._formBuilder.group({
                                nombre   : ['', Validators.required],
                                subtitulo : ['', Validators.required],
                                duracion: ['', Validators.required],
                                categoria: ['', Validators.required],
                                etapa: ['', Validators.required]
                            })/*,
                            step2: this._formBuilder.group({
                                firstName: ['', Validators.required],
                                lastName : ['', Validators.required],
                                userName : ['', Validators.required],
                                about    : ['']
                            })*/
                        });
                        this.getCourse(params['id']);
                        this.getLessons(params['id']);
                      }else{
                          
                        this.showLessons = true;
                        this.horizontalStepperForm = this._formBuilder.group({
                            step1: this._formBuilder.group({
                            nombre      : ['', Validators.required],
                            subtitulo      : ['', Validators.required],
                            duracion    : ['', Validators.required],
                            categoria  : ['', Validators.required],
                            etapa   : ['', Validators.required]
                            })/*,
                            step2: this._formBuilder.group({
                                firstName: ['', Validators.required],
                                lastName : ['', Validators.required],
                                userName : ['', Validators.required],
                                about    : ['']
                            })*/
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

      getCourse(id: any): void {
        this._coursesService.get(id)
          .subscribe(
            data => {
              this.course = data;
              //console.log(data);
              this.setValueEdit(data);
            },
            error => {
              console.log(error);
            });
      }

      getLessons(id: any): void {
        this._coursesService.getLessonByCurso(id)
          .subscribe(
            data => {
              this.lecciones = data;
              this.showLessons = true;
            },
            error => {
              console.log(error);
            });
      }

      setValueEdit(data: any){
        this.horizontalStepperForm.setValue({step1: {
            'nombre'          : data.nombre,
            'subtitulo'      : data.subtitulo,
            'duracion'      : data.duracion,
            'categoria'      : data.categoria,
            'etapa'      : data.etapa,
        }});
    }

    
    saveLesson(data: any) {      
        //console.log('data',data);
        this.lessons = data;
    }

    
    /**
     * Sign up
     */
     signUp(): void
     {
         // Do nothing if the form is invalid
         if ( this.horizontalStepperForm.invalid )
         {
             return;
         }

         if(!this.lessons || this.lessons < 1){

            // Open the dialog and save the reference of it
        let config: any = {
            "title": "Acción Invalida",
            "message": "Lección vacia",
            "icon": {
              "show": true,
              "name": "heroicons_outline:exclamation",
              "color": "warn"
            },
            "actions": {
              "cancel": {
                "show": true,
                "label": "Cancelar"
              }
            },
            "dismissible": true
          };
          const dialogRef = this._fuseConfirmationService.open(config);
          return;

         }
 
         // Disable the form
         this.horizontalStepperForm.disable();

         const val = this.horizontalStepperForm.value;

    if(this.id){
        const data_general2:any = {
            'nombre'          : val.step1.nombre,
            'subtitulo'      : val.step1.subtitulo,
            'categoria' : val.step1.categoria,
            'duracion'   : val.step1.duracion,
            'etapa'   : val.step1.etapa,
            'lessons' : this.lessons
          }
    	this._coursesService.update(this.id, data_general2)
        .subscribe(
            (response) => {

                // Navigate to the confirmation required page
                this._router.navigateByUrl('/courses');
            },
            (response) => {

                // Re-enable the form
                this.horizontalStepperForm.enable();

                // Reset the form
                //this.signUpNgForm.resetForm();
            }
        );

    }else{

            const data_general:any = {
                'nombre'          : val.step1.nombre,
                'subtitulo'      : val.step1.subtitulo,
                'duracion' : val.step1.duracion,
                'categoria' : val.step1.categoria,
                'etapa'   : val.step1.etapa,
                'lessons' : this.lessons
              }

            this._coursesService.create(data_general)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/courses');
                },
                (response) => {

                    // Re-enable the form
                    this.horizontalStepperForm.enable();

                    // Reset the form
                    //this.signUpNgForm.resetForm();
                }
            );
          
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
