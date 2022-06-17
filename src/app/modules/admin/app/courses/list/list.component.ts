import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, Inject, ViewChild, Input, NgZone,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CoursesService } from '../courses.service';

import { FuseConfirmationService } from '@fuse/services/confirmation';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../../../environments/environment";

@Component({
    selector       : 'courses-list',
    templateUrl    : './list.component.html',
    styleUrls: ['./list.component.css'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesListComponent implements OnInit, OnDestroy
{
  displayedColumns: string[] = [/*'img',*/'nombre', 'subtitulo', 'duracion', 'categoria','completado','etapa', 'tablaAcciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    
  @ViewChild("query") query: ElementRef;

  currentCurso: any = {};
  currentIndex = -1;
  nombre = '';
  title = 'Cursos';
  searchBoard: any = '';
  listBoard: any = '';
  searchCategory: any = '';
  showBoard: boolean = false;
  id_board: any = "";
  url: any = "";
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
      name: 'subtitulo',
      label: 'Subtítulo'
    },
    {
      name: 'duracion',
      label: 'Duración'
    },
    {
      name: 'categoria',
      label: 'Categoría'
    },
    {
      name: 'completado',
      label: 'Completado'
    },
    {
      name: 'etapa',
      label: 'Etapa'
    }];

  cursos = new MatTableDataSource<any>();

    filters: {
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    tablero: any = [];

    todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

    done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.createTxt();
  }

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _coursesService: CoursesService,
        private _fuseConfirmationService: FuseConfirmationService,
        private sanitizer: DomSanitizer,
        private http: HttpClient
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
      //this.tablero.push({'title': 'Tablero 1', "data": ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep']});
      //this.tablero.push({'title': 'Tablero 2', "data": ['Get to work2', 'Pick up groceries2', 'Go home2', 'Fall asleep2']});
      //this.retrieveCursos();
      
      setTimeout(() => {
        this.readTxt();
      }, 2000);
     
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

    boardLabel(event: Event){
      
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchBoard = filterValue;
    }

    searchLabel(event: Event){
      
      const filterValue = (event.target as HTMLInputElement).value;
      this.listBoard = filterValue;
    }

    categoryLabel(event: Event){
      
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchCategory = filterValue;
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

    retrieveCursos(): void {
        this._coursesService.getAll()
          .subscribe(
            data => {
              this.cursos.data = data;
              this.dataSource.data = data;
              //console.log(data);
            },
            error => {
              console.log(error);
            });
      }

    createBoard(): void {
      this._coursesService.createBoard()
        .subscribe(
          (data: any) => {
            console.log('data_board:', data);
            this.id_board = data.id;     
            this.url =  this.sanitizer.bypassSecurityTrustResourceUrl('https://miro.com/app/live-embed/'+data.id+'/?moveToViewport=-23165,-5837,13803,7546');
            this.searchBoard = data.id;
            this.showBoard = true;
          },
          error => {
            console.log(error);
          });
    }

    
    ListBoard(): void {
            this.url =  this.sanitizer.bypassSecurityTrustResourceUrl('https://miro.com/app/live-embed/'+this.listBoard+'/?moveToViewport=-23165,-5837,13803,7546');
            this.showBoard = true;
    }

    createCategory(): void {
      this.tablero.push({'title': this.searchCategory, "data": []});
    }

    viewBoard(): void {
      this._coursesService.viewBoard(this.searchBoard)
        .subscribe(
          (data: any) => {
            console.log('data_board:', data); 
          },
          error => {
            console.log(error);
          });
    }

    createTxt(): void {
      this._coursesService.createTxt({tablero: JSON.stringify(this.tablero)})
        .subscribe(
          (data: any) => {
            //console.log('data_txt:', data);
          },
          error => {
            console.log(error);
          });
    }

    
    readTxt(): void {
      this.http.get<[]>(environment.API_TXT + 'assets/txt/tablero.txt')
        .subscribe(
          (data: any) => {
            //const json_data = JSON.parse(data);
            this.tablero = [];
            for(let c in data){   
              this.tablero.push({'title': data[c].title, "data": data[c].data});
            }
            
            this.query.nativeElement.focus();

            setTimeout(() => {
              if(location.pathname == '/courses'){
                this.readTxt();
              }
            }, 9000);
          },
          error => {
            console.log(error);
          });
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
