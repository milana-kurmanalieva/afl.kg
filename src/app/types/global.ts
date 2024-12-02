declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.json'
declare module '*.svg' {
 export const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}
declare const __IS_DEV__: boolean;
