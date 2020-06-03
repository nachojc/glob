import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './drawer.component';
import {LabelPipe} from '../../pipes/label/label.pipe';



@NgModule({
    declarations: [
        DrawerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DrawerComponent
    ]
})
export class DrawerModule { }
