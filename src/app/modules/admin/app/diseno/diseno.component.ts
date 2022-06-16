import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'diseno',
    templateUrl    : './diseno.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisenoComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
