// Build command: wasm-pack build --target web

use wasm_bindgen::prelude::*;

mod fibonacci;
mod random;

pub use fibonacci::*;
pub use random::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
