export const appendToRoot = (element: HTMLElement) => {
  const root = document.getElementById("root");
  root?.appendChild(element);
};
