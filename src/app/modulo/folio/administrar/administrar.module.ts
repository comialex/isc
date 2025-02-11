import {NgModule} from '@angular/core';
import {AdministrarRoutingModule} from './administrar-routing.module';
import {AdministrarComponent} from './administrar.component';
import {ErrorComponent} from "@isc/core/shared/components/error/error.component";
import {ToolbarModule} from "primeng/toolbar";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";
import {InputGroupModule} from "primeng/inputgroup";
import {SharedModule} from "@isc/shared/shared.module";
import {PaginatorModule} from "primeng/paginator";

@NgModule({
  declarations: [AdministrarComponent],
  imports: [AdministrarRoutingModule, ErrorComponent, ToolbarModule, DropdownModule, CalendarModule, TableModule, InputGroupModule, SharedModule, PaginatorModule,]
})
export class AdministrarModule {
}
