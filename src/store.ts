import { reactive } from 'vue'

const store = reactive({
    // example: localStorage.getItem('example') || defaultExample,
    save: (key, value) => {
        localStorage.setItem(key, value)
        store[key] = value
    },
})

export default store
