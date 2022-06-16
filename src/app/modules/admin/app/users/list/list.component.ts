import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../users.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector       : 'users-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent implements OnInit, OnDestroy
{
    displayedColumns: string[] = [/*'img',*/'nombre', 'rut', 'user', 'fono','roles', 'tablaAcciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  currentUsuario: any = {};
  currentIndex = -1;
  nombre = '';
  title = 'Usuarios';
  config: any = [
    /*{
      name: 'img',
      label: 'Foto',
      img: true
    },*/{
      name: 'nombre',
      label: 'Nombre'
    },
    {
      name: 'rut',
      label: 'RUT'
    },
    {
      name: 'user',
      subname: 'correo_login',
      label: 'Correo'
    },
    {
      name: 'fono',
      label: 'Teléfono'
    },
    {
      name: 'roles',
      label: 'Rol'
    }];

  usuarios = new MatTableDataSource<any>();

    filters: {
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _usersService: UsersService,
        private _fuseConfirmationService: FuseConfirmationService
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

        this.retrieveUsuarios();

    }

    ngAfterViewInit(){
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event){
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if(this.dataSource.paginator){
            this.dataSource.paginator.firstPage();
        }
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

    retrieveUsuarios(): void {
        this._usersService.getAll()
          .subscribe(
            data => {
              this.usuarios.data = data;
              this.dataSource.data = data;
              //console.log(data);
            },
            error => {
              console.log(error);
            });
      }
    
      refreshList(): void {
        this.retrieveUsuarios();
        this.currentUsuario = {};
        this.currentIndex = -1;
      }

      imgError(ev: any){

        let source = ev.srcElement;
        let imgSrc = 'assets/images/avatars/brian-hughes.jpg';
        source.src = imgSrc;
      }
    
      editData(usuario: any): void {
        this.currentUsuario = usuario;
        /*const dialogRef = this.dialog.open(UsuarioDialog, {
          width: '1200px', height: 'auto', data: usuario, disableClose: true,
          panelClass: 'custom-dialog-container'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.refreshList();
          }
        });*/
      }

      deleteData(usuario: any): void {

        // Open the dialog and save the reference of it
        let config: any = {
          "title": "Eliminar Usuario",
          "message": "¿Está seguro de que desea eliminar a este usuario de forma permanente? <span class=\"font-medium\">¡Esta acción no se puede deshacer!</span>",
          "icon": {
            "show": true,
            "name": "heroicons_outline:exclamation",
            "color": "warn"
          },
          "actions": {
            "confirm": {
              "show": true,
              "label": "Eliminar",
              "color": "warn"
            },
            "cancel": {
              "show": true,
              "label": "Cancelar"
            }
          },
          "dismissible": true
        };
        const dialogRef = this._fuseConfirmationService.open(config);

        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if(result && result == 'confirmed'){
              this.confirmDelete(usuario.id);
            }
            
        });
      }

      confirmDelete(id){
        this._usersService.delete(id)
          .subscribe(
            response => {
              //console.log(response);
              this.refreshList();
            },
            error => {
              console.log(error);
            });
      }
    
      removeAllData(): void {
        this._usersService.deleteAll()
          .subscribe(
            response => {
              //console.log(response);
              this.refreshList();
            },
            error => {
              console.log(error);
            });
      }

      openDiagoloAdd(): void {
            console.log('add');
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.filters.query$.next(query);
    }

    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void
    {
        this.filters.hideCompleted$.next(change.checked);
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
}
