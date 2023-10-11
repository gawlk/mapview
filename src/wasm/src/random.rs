use rand::prelude::*;
use wasm_bindgen::prelude::*;

use crate::log;

#[wasm_bindgen]
pub fn rand() -> u64 {
    let value = random();
    log(&format!("Random value: {value}"));
    value
}
