import { NgModule } from '@angular/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatDialogModule,
    MatMenuModule,
    MatBadgeModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatChipsModule,
        MatDialogModule,
        MatMenuModule,
        MatBadgeModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatMomentDateModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatGridListModule,
        MatCardModule,
        MatDividerModule,
        MatChipsModule,
        MatDialogModule,
        MatMenuModule,
        MatBadgeModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatMomentDateModule
    ]
})

export class MaterialModule { }