import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/app/contacts/contacts.guards';
import { ContactsContactResolver, ContactsCountriesResolver, ContactsResolver, ContactsTagsResolver } from 'app/modules/admin/app/contacts/contacts.resolvers';
import { ContactsComponent } from 'app/modules/admin/app/contacts/contacts.component';
import { ContactsListComponent } from 'app/modules/admin/app/contacts/list/list.component';
import { ContactsDetailsComponent } from 'app/modules/admin/app/contacts/details/details.component';

export const contactsRoutes: Route[] = [
    {
        path     : '',
        component: ContactsComponent,
        resolve  : {
            tags: ContactsTagsResolver
        },
        children : [
            {
                path     : '',
                component: ContactsListComponent,
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
