// CSS Modules 앰비언트 타입 선언 — *.module.css import를 타입 안전하게 처리
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
