import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BranchLocator';

  suggestions;

  completeMethod(event) {
    const brands = ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'Volvo', 'VW'];

    this.suggestions = brands.filter((item) => item.toLowerCase().includes(event.query.toLowerCase()));
    console.log(this.suggestions);
  }
}
