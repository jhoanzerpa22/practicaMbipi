import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';

import { coursesRoutes } from './courses.routing';
import { CoursesComponent } from './courses.component';
import { CoursesDetailsComponent } from './details/details.component';
import { CoursesListComponent } from './list/list.component';

import { FuseHighlightModule } from '@fuse/components/highlight';
import { MatStepperModule } from '@angular/material/stepper';


import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import * as moment from 'moment';
import { contactsRoutes } from 'app/modules/admin/app/contacts/contacts.routing';
import { ContactsComponent } from 'app/modules/admin/app/contacts/contacts.component';
import { ContactsDetailsComponent } from 'app/modules/admin/app/contacts/details/details.component';
import { ContactsListComponent } from 'app/modules/admin/app/contacts/list/list.component';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        CoursesComponent,
        CoursesDetailsComponent,
        CoursesListComponent,
        ContactsComponent,
        ContactsListComponent,
        ContactsDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(coursesRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatTabsModule,
        MatDividerModule,
        FuseHighlightModule,
        MatStepperModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatMenuModule,
        MatMomentDateModule,
        MatRadioModule,
        MatRippleModule,
        DragDropModule
    ]
})
export class CoursesModule
{
}
