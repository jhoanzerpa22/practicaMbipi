import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
// import { Category, Course } from 'app/modules/admin/apps/academy/academy.types';
import { DisenoService } from '../diseno.service';
import { Category, Course } from '../diseno.types';
// import { AcademyService } from 'app/modules/admin/apps/academy/academy.service';
import { CoursesService } from 'app/modules/admin/app/courses/courses.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector       : 'diseno-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisenoDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('courseSteps', {static: true}) courseSteps: MatTabGroup;
    categories: Category[];
    //course: Course;
    course: any = {};
    lessons: any = [];
    video: any;
    currentStep: number = 0;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _disenoService: DisenoService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _coursesService: CoursesService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
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
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
        
        // Get the categories
        this._disenoService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {

                // Get the categories
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

            this.route.params.subscribe(params => {

                this._coursesService.get(params['id'])
                .subscribe(
                    data => {
                    this.course = data;
                    this.lessons = data.lessons.sort((a, b) =>
                    a.orden - b.orden
                    );
                    
                    // Go to step
                    this.goToStep(0);
                },
                    error => {
                    console.log(error);
                });
            });

        // Get the course
        /*this._academyService.course$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((course: Course) => {

                // Get the course
                this.course = course;

                // Go to step
                this.goToStep(course.progress.currentStep);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });*/

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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    changeVideo($event:any, id: any){
        //console.log(event);
        //if (event.data == 0){
            this._coursesService.changeLesson(id)
                .subscribe(
                    data => {
                    this.lessons = data.sort((a, b) =>
                    a.orden - b.orden
                    );
                },
                    error => {
                    console.log(error);
                });
            this.goToNextStep();
        //}
    }

    goVideoStep(index){
        //this.getVideoIframe(this.lessons[index].url);
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
        
        //this.goVideoStep(step);

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
     * Go to next step
     */
    goToNextStep(): void
    {
        // Return if we already on the last step
        //if ( this.currentStep === this.course.totalSteps - 1 )
        if ( this.currentStep === this.lessons.length - 1 )
        {
            //return;
            this.goToStep(0);
        }else{
            // Go to step
            this.goToStep(this.currentStep + 1);
        }
        
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

    getVideoIframe(url: any) {
        var video, results;
        /*if (url === null) {
            return '';
        }*/
        results = url.match('[\\?&]v=([^&#]*)');
        video   = (results === null) ? url : results[1];

        //return video;
    
        return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);
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
