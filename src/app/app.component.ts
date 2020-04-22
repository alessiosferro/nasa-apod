import { Apod } from './model/apod';
import { NasaService } from './nasa.service';
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, TemplateRef, ViewRef, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, of, EMPTY } from 'rxjs';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil, tap, switchMap, debounceTime, catchError, retry, retryWhen } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public dateCtl: FormControl;
  public today: string;
  public apod$: Observable<Apod>;
  public imageLoaded = {
    status: false,
    error: null
  }

  private destroy$ = new Subject<void>();
  @ViewChild('image') image: ElementRef<HTMLDivElement>

  constructor(
    private Nasa: NasaService,
    private Toastr: ToastrService,
    private CDRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
    this.dateCtl = new FormControl([this.today]);
    this.apod$ = this.Nasa.apod;
    this.getNewApodOnDateChange();
    this.Nasa.getApod().subscribe(apod => this.getApodImage(apod));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getNewApodOnDateChange() {
    this.dateCtl.valueChanges.pipe(
      debounceTime(500),
      switchMap(date => this.Nasa.getApod(date)),
      takeUntil(this.destroy$),
      retryWhen(errors => errors.pipe(
        tap(() => this.Toastr.error('Date must be between Jun 16, 1995 and Apr 22, 2020.'))
      ))
    ).subscribe(apod => this.getApodImage(apod));
  }

  getApodImage(apod: Apod) {
    this.CDRef.detectChanges();

    this.imageLoaded = {
      status: false,
      error: null
    };

    let image = asyncImageLoader(apod.url, apod.title)

    const child = this.image.nativeElement.firstChild
    if (child) {
      this.image.nativeElement.removeChild(child);
    }

    image.then((res: HTMLImageElement) => {
      this.imageLoaded = {
        status: true,
        error: null
      }

      this.image.nativeElement.appendChild(res);
    }).catch(error => {
      this.imageLoaded = {
        status: false,
        error
      }
    })

  }
}

function asyncImageLoader(url: string, title: string) {
  return new Promise((resolve, reject) => {
    var image = new Image();
    image.src = url;
    image.title = title;
    image.alt = title;
    image.width = 600
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('could not load image'))
  })
}