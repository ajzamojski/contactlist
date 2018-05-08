import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { ModalModule } from 'ngx-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { AppComponent } from './app.component';
import { ContactlistComponent } from './components/contactlist/contactlist.component';
import { ContacteditComponent } from './components/contactedit/contactedit.component';
import { ContactaddComponent } from './components/contactadd/contactadd.component';
import { AppRoutingModule } from './/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    ContactlistComponent,
    ContacteditComponent,
    ContactaddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
