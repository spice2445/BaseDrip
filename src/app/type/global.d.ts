interface moduleIScss {
  [index: string]: string;
}

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      NEXT_PUBLIC_ALCHEMY_ID: string;
      NEXT_PUBLIC_RAINBOW_PROJECT_ID: string;
    }
  }
}
