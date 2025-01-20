interface Turnstile {
    render(container: HTMLElement, options: {
      sitekey: string;
      callback: (token: string) => void;
    }): void;
  }
  
  interface Window {
    turnstile: Turnstile;
  }