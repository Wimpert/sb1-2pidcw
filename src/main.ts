import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

interface Registration {
  groupName: string;
  participants: string;
  option: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container mx-auto p-4 max-w-lg">
      <h1 class="text-2xl font-bold mb-4">Trot 2025 Inschrijving</h1>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="form-group">
          <label for="groupName" class="block text-sm font-medium text-gray-700"
            >Groep naam:</label
          >
          <input
            type="text"
            id="groupName"
            [(ngModel)]="registration.groupName"
            name="groupName"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div class="form-group">
          <label
            for="participants"
            class="block text-sm font-medium text-gray-700"
            >Participant Names (one per line):</label
          >
          <textarea
            id="participants"
            [(ngModel)]="registration.participants"
            name="participants"
            rows="5"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="options-container space-y-2">
          <div class="radio-option flex items-center bg-teal-300">
            <input
              type="radio"
              id="langLang"
              name="option"
              value="lang/lang"
              [(ngModel)]="registration.option"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label
              for="langLang"
              class="ml-3 block text-sm font-medium text-gray-700"
              >Lang/Lang</label
            >
          </div>

          <div
            class="transition ease-in-out delay-150 radio-option flex items-center border-t-8 bg-teal-300"
            *ngFor="let opt of movingOptions; let i = index"
          >
            <input
              type="radio"
              [id]="'option' + i"
              name="option"
              [value]="opt"
              [(ngModel)]="registration.option"
              (mouseenter)="moveOption($event)"
              (change)="moveOption($event)"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label
              [for]="'option' + i"
              (mouseenter)="moveOption($event)"
              class="ml-3 block text-sm font-medium text-gray-700"
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
          Register
        </button>
      </form>

      <div *ngIf="submitted" class="mt-6">
        <h2 class="text-xl font-bold">Registration Successful!</h2>
        <p class="mt-2">Group: {{ registration.groupName }}</p>
        <p>Option: {{ registration.option }}</p>
        <h3 class="mt-4 text-lg font-semibold">Participants:</h3>
        <ul class="list-disc list-inside">
          <li *ngFor="let participant of getParticipantsList()">
            {{ participant }}
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class App {
  registration: Registration = {
    groupName: "",
    participants: "",
    option: "",
  };
  submitted = false;
  movingOptions = ["Kort/Lang", "Lang/Kort", "Kort/Kort"];

  moveOption(event: Event) {
    const element = event.target as HTMLElement;
    const radioOptionDiv = element.closest(".radio-option") as HTMLElement;

    if (radioOptionDiv && !radioOptionDiv.querySelector("#langLang")) {
      const offsetX = (Math.random() - 0.5) * 500;
      const offsetY = (Math.random() - 0.5) * 500;
      radioOptionDiv.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      setTimeout(() => {
        this.registration.option = "lang/lang";
      }, 100);
      setTimeout(() => {
        radioOptionDiv.style.transform = "translate(0, 0)";
      }, 500);
    }
  }

  select(event: Event) {
    console.log("select");
  }

  isFormValid(): boolean {
    return (
      this.registration.groupName.trim() !== "" &&
      this.registration.participants.trim() !== "" &&
      this.registration.option === "lang/lang"
    );
  }

  getParticipantsList(): string[] {
    return this.registration.participants
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.submitted = true;
      console.log("Registration submitted:", this.registration);
    }
  }
}

bootstrapApplication(App);
