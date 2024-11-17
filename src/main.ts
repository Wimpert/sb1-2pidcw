import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { BinComponent } from "./components/bin.component";

interface Registration {
  groupName: string;
  email: string;
  phone: string;
  participants: Array<string>;
  option: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FormsModule, CommonModule, BinComponent],
  providers: [],
  template: `
    <div class="container mx-auto p-4 max-w-lg text-sky-800">
      @if (!submitted) {

      <h1 class="text-xl font-bold mb-4">Trot 20in25 Inschrijving:</h1>

      <span class="text-sm">
        Schrijf je groep in voor Trot 20in25. We beperken ons tot groepen van
        maximum 6 deelnemers. Vergeet ook zeker niet je type trot te selecteren.
        <strong
          >De inschrijving is pas geldig na het invullen van dit formulier en
          het overschrijven van €79,30 + €6 administrative kosten pp op rekening
          nummer BEXX XXXX XXXX XXXX</strong
        ></span
      >

      <form (ngSubmit)="onSubmit()" class="pt-4 space-y-3">
        <div class="form-group">
          <input
            type="text"
            id="groupName"
            [(ngModel)]="registration.groupName"
            name="groupName"
            placeholder="Groepsnaam"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div class="form-group">
          <input
            type="text"
            id="email"
            [(ngModel)]="registration.email"
            name="email"
            placeholder="email"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div class="form-group">
          <input
            type="text"
            id="phone"
            [(ngModel)]="registration.phone"
            name="phone"
            placeholder="gsm nummer"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>

        <div class="form-group">
          <label
            for="participants"
            class="block text-sm font-medium text-gray-700"
            >Vul hier de lijst met deelnemers aan:
          </label>
          @for (participant of registration.participants; track $index; let i =
          $index){
          <div class="flex items-center space-x-2">
            <input
              type="text"
              [(ngModel)]="registration.participants[i]"
              name="participant{{ i }}"
              placeholder="Deelnemer {{ i + 1 }}"
              class="mt-1 grow border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
            <app-trot-bin (delete)="removeParticipant(i)" />
          </div>
          }
          <button
            *ngIf="this.registration.participants.length < 10"
            type="button"
            (click)="addParticipant()"
            class="text-indigo-600 hover:text-indigo-900 underline mt-2"
          >
            Voeg een deelnemer toe
          </button>
        </div>

        <div class="options-container space-y-2">
          <h1 class="text-lg font-bold mb-4">Kies het type trot:</h1>
          <div
            class="radio-option flex items-center rounded-lg p-2"
            [ngClass]="{
              'bg-slate-200': registration.option !== 'lang/lang',
              'bg-teal-300': registration.option === 'lang/lang'
            }"
          >
            <input
              type="radio"
              id="langLang"
              name="option"
              value="lang/lang"
              [(ngModel)]="registration.option"
              (change)="onOptionChange()"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600"
            />
            <label for="langLang" class="ml-3 block text-gray-700"
              >Lang Wandelen / Lang Fietsen</label
            >
          </div>

          <div
            class="transition ease-in-out delay-150 radio-option flex items-center rounded-lg p-2"
            *ngFor="let opt of movingOptions; let i = index"
            [ngClass]="{
              'bg-slate-200': registration.option !== opt,
              'bg-teal-300': registration.option === opt
            }"
            (click)="moveOption($event, true)"
          >
            <input
              type="radio"
              [id]="'option' + i"
              name="option"
              [value]="opt"
              [(ngModel)]="registration.option"
              (mouseenter)="moveOption($event)"
              (change)="onOptionChange()"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600"
            />
            <label
              [for]="'option' + i"
              (mouseenter)="moveOption($event)"
              class="ml-3 block text-gray-700"
            >
              {{ opt }}
            </label>
          </div>
        </div>

        <button
          type="submit"
          class="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          [disabled]="!isFormValid()"
        >
          Schrijf in
        </button>
      </form>

      } @else {
      <div class="mt-6">
        <h2 class="text-xl font-bold">Inschrijving succesvol!</h2>
        <span>We stuurden een email naar {{ registration.email }}</span>
        <p class="mt-2">Groep: {{ registration.groupName }}</p>
        <p>Type trot: {{ registration.option }}</p>
        <h3 class="mt-4 text-lg font-semibold">Deelnemers:</h3>
        <ul class="list-disc list-inside">
          @for (participant of registration.participants; track participant; let
          i = $index) {
          <li>{{ participant }}</li>
          }
        </ul>
      </div>
      }
    </div>
  `,
})
export class App {
  registration: Registration = {
    groupName: "",
    email: "",
    participants: [""],
    option: "",
    phone: "",
  };
  submitted = false;
  movingOptions = [
    "Kort wandelen / Lang fietsen",
    "Lang wandelen / Kort fietsen",
    "Kort wandelen / Kort fietsen",
  ];

  constructor(private http: HttpClient) {}

  addParticipant() {
    if (this.registration.participants.length < 5) {
      this.registration.participants.push("");
    }
  }

  removeParticipant(index: number) {
    if (this.registration.participants.length > 1) {
      this.registration.participants.splice(index, 1);
    }
  }

  moveOption(event: Event, checked = false) {
    const element = event.target as HTMLElement;
    const radioOptionDiv = element.closest(".radio-option") as HTMLElement;

    if (radioOptionDiv && !radioOptionDiv.querySelector("#langLang")) {
      const offsetX = (Math.random() - 0.5) * 500;
      const offsetY = (Math.random() - 0.5) * 500;
      radioOptionDiv.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      if (checked) {
        this.registration.option = null as any as string;
        setTimeout(() => {
          this.registration.option = "lang/lang";
        }, 500);
      }

      setTimeout(() => {
        radioOptionDiv.style.transform = "translate(0, 0)";
      }, 500);
    }
  }

  isFormValid(): boolean {
    return (
      this.registration.groupName.trim() !== "" &&
      this.registration.participants.every((name) => name.trim() !== "") &&
      this.registration.option === "lang/lang"
    );
  }

  onOptionChange() {
    // This method is called when an option is selected
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.http
        .post("/.netlify/functions/subscribe", this.registration)
        .subscribe(
          (response) => {
            console.log("Server response:", response);
            this.submitted = true;
          },
          (error) => {
            alert(
              "Er ging iets mis, probeer opnieuw. Indien inschrijven niet lukt, stuur dan een mail naar info@trotkuurne.be"
            );
            console.error("Error:", error);
          }
        );
    }
  }
}

bootstrapApplication(App, {
  providers: [provideHttpClient()],
});
