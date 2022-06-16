import { Injectable } from '@angular/core';
import { from, map } from 'rxjs';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { courses as coursesData } from 'app/mock-api/apps/courses/data';

@Injectable({
    providedIn: 'root'
})
export class CoursesMockApi
{
    private _courses: any[] = coursesData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ courses - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/courses/all')
            .reply(() => {

                // Clone the courses
                const courses = cloneDeep(this._courses);

                // Sort the courses by the name field by default
                courses.sort((a, b) => a.name.localeCompare(b.name));

                // Return the response
                return [200, courses];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ courses Search - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/courses/search')
            .reply(({request}) => {

                // Get the search query
                const query = request.params.get('query');

                // Clone the courses
                let courses = cloneDeep(this._courses);

                // If the query exists...
                if ( query )
                {
                    // Filter the courses
                    courses = courses.filter(course => course.name && course.name.toLowerCase().includes(query.toLowerCase()));
                }

                // Sort the courses by the name field by default
                courses.sort((a, b) => a.name.localeCompare(b.name));

                // Return the response
                return [200, courses];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ course - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/courses/course')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the courses
                const courses = cloneDeep(this._courses);

                // Find the course
                const course = courses.find(item => item.id === id);

                // Return the response
                return [200, course];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ course - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/courses/course')
            .reply(() => {

                // Generate a new course
                const newCourse = {
                    id          : FuseMockApiUtils.guid(),
                    avatar      : null,
                    name        : 'New Course',
                    emails      : [],
                    phoneNumbers: [],
                    job         : {
                        title  : '',
                        company: ''
                    },
                    birthday    : null,
                    address     : null,
                    notes       : null,
                    tags        : []
                };

                // Unshift the new Course
                this._courses.unshift(newCourse);

                // Return the response
                return [200, newCourse];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Course - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/courses/course')
            .reply(({request}) => {

                // Get the id and course
                const id = request.body.id;
                const course = cloneDeep(request.body.course);

                // Prepare the updated course
                let updatedCourse = null;

                // Find the Course and update it
                this._courses.forEach((item, index, courses) => {

                    if ( item.id === id )
                    {
                        // Update the Course
                        courses[index] = assign({}, courses[index], course);

                        // Store the updated course
                        updatedCourse = courses[index];
                    }
                });

                // Return the response
                return [200, updatedCourse];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Course - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/courses/course')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the course and delete it
                this._courses.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._courses.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });
    }
}
