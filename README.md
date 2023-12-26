## Loading Spinner with Effection in React

Example of a detailed loading spinner implemented as a hook. It gives users feedback when the request takes too long to load. It automatically retries up to 3 times if the request fails.

- [`App.tsx`][app-tsx] - shows all of the scenarios executed by the spinner
- [`useLoader hook`][useloader-hook] - executes the operation
- [`createLoader`][create-loader] - the main operation that executes the entire loader
- [`createSpinner`][create-spinner] - operation responsible for presenting the loading spinner
- [`LoadingSpinner component`][loading-spinner-component] - the component that's responsible for showing all of the spinners

[app-tsx]: /src/App.tsx
[useloader-hook]: src/hooks/useLoader.ts
[create-loader]: src/operations/createLoader.ts
[create-spinner]: src/operations/createSpinner.ts
[loading-spinner-component]: src/components/LoadingSpinner.tsx
