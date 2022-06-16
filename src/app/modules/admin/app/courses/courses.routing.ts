import { Route } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { CoursesDetailsComponent } from './details/details.component';
import { CoursesListComponent } from './list/list.component';
import { CanDeactivateContactsDetails } from 'app/modules/admin/app/contacts/contacts.guards';
import { ContactsContactResolver, ContactsCountriesResolver, ContactsResolver, ContactsTagsResolver } from 'app/modules/admin/app/contacts/contacts.resolvers';
import { ContactsComponent } from 'app/modules/admin/app/contacts/contacts.component';
import { ContactsDetailsComponent } from 'app/modules/admin/app/contacts/details/details.component';

export const coursesRoutes: Route[] = [
    {
        path     : '',
        component: CoursesComponent,/*
        resolve  : {
            categories: AcademyCategoriesResolver
        },*/
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: CoursesListComponent/*,
                resolve  : {
                    courses: AcademyCoursesResolver
                }*/
            },
            {
                path     : 'create',
                component:CoursesDetailsComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            },
            {
                path     : ':id',
                component:CoursesDetailsComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
