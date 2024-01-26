export const getNode = <T extends HTMLElement = HTMLElement>(html: string): T => {
  return new DOMParser().parseFromString(html, 'text/html').body.firstChild as T;
};
