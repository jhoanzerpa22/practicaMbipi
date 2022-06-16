import { Route } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersDetailsComponent } from './details/details.component';
import { UsersListComponent } from './list/list.component';

export const usersRoutes: Route[] = [
    {
        path     : '',
        component: UsersComponent,/*
        resolve  : {
            categories: AcademyCategoriesResolver
        },*/
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: UsersListComponent/*,
                resolve  : {
                    courses: AcademyCoursesResolver
                }*/
            },
            {
                path     : 'create',
                component:UsersDetailsComponent/*,
                resolve  : {
                    course: AcademyCourseResolver
                }*/
            },
            {
                path     : ':id',
                component:UsersDetailsComponent/*,
                resolve  : {
                    course: AcademyCourseResolver
                }*/
            }
        ]
    }
];
