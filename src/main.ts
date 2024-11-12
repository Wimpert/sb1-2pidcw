import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";

interface Registration {
  groupName: string;
  email: string;
  participants: Array<string>;
  option: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [],
  template: `
    <div class="container mx-auto p-4 max-w-lg">
      <h1 class="text-xl font-bold mb-4">Trot 2025 Inschrijving</h1>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="form-group">
          <input
            type="text"
            id="groupName"
            [(ngModel)]="registration.groupName"
            name="groupName"
            placeholder="Groepsnaam"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
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
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
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
          <div class="flexitems-center flex space-x-2">
            <input
              type="text"
              [(ngModel)]="registration.participants[i]"
              name="participant{{ i }}"
              placeholder="Deelnemer {{ i + 1 }}"
              required
              class="mt-1 grow border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
            />
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
            class="radio-option flex items-center bg-teal-300 rounded-lg p-3"
          >
            <input
              type="radio"
              id="langLang"
              name="option"
              value="lang/lang"
              [(ngModel)]="registration.option"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600"
            />
            <label for="langLang" class="ml-3 block text-gray-700"
              >Lang Wandelen / Lang Fietsen</label
            >
          </div>

          <div
            class="transition ease-in-out delay-150 radio-option flex items-center bg-teal-300 rounded-lg p-3"
            *ngFor="let opt of movingOptions; let i = index"
            (click)="moveOption($event, true)"
          >
            <input
              type="radio"
              [id]="'option' + i"
              name="option"
              [value]="opt"
              [(ngModel)]="registration.option"
              (mouseenter)="moveOption($event)"
              (change)="moveOption($event, true)"
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

      <div *ngIf="submitted" class="mt-6">
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
    </div>
  `,
})
export class App {
  registration: Registration = {
    groupName: "",
    email: "",
    participants: [""],
    option: "",
  };
  submitted = false;
  movingOptions = [
    "Kort wandelen / Lang fietsen",
    "Lang wandelen / Kort fietsen",
    "Kort wandelen / Kort fietsen",
  ];

  constructor(private http: HttpClient) {}

  addParticipant() {
    if (this.registration.participants.length < 10) {
      this.registration.participants.push("");
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
