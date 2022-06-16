import { Route } from '@angular/router';
import { DisenoComponent } from './diseno.component';
import { DisenoCategoriesResolver, DisenoCourseResolver, DisenoCoursesResolver } from './diseno.resolvers';
import { DisenoDetailsComponent } from './details/details.component';
import { DisenoListComponent } from './list/list.component';
// import { AcademyComponent } from 'app/modules/admin/apps/academy/academy.component';
// import { AcademyListComponent } from 'app/modules/admin/apps/academy/list/list.component';
// import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
// import { AcademyCategoriesResolver, AcademyCourseResolver, AcademyCoursesResolver } from 'app/modules/admin/apps/academy/academy.resolvers';

export const disenoRoutes: Route[] = [
    {
        path     : '',
        component: DisenoComponent,
        resolve  : {
            categories: DisenoCategoriesResolver
        },
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: DisenoListComponent,
                resolve  : {
                    courses: DisenoCoursesResolver
                }
            },
            {
                path     : ':id',
                component: DisenoDetailsComponent,
                /*resolve  : {
                    course: AcademyCourseResolver
                }*/
            }
        ]
    }
];
