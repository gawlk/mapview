declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@heroicons/vue/outline'
declare module '@heroicons/vue/solid'
