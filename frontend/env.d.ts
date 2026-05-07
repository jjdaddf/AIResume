/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vuedraggable' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<
    { list: any[]; itemKey: string | ((item: any) => string) },
    any,
    any
  > & {
    new (): any
  }
  export default component
}

declare module 'html2pdf.js' {
  const html2pdf: any
  export default html2pdf
}
