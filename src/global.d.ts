// CSS imports
declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}

// Image imports
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}