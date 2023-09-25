default:
  just --list

alias d := dev
dev:
  ($npm_execpath outdated || read -p "Press enter to ignore...")
  $npm_execpath vite --host

alias c := check
check:
  $npm_execpath tsc --noEmit --skipLibCheck

alias b := build
build:
  #!/usr/bin/env sh
  if [ command -v zip ]
  then
    cd src/assets/templates
    rm -f templates.zip
    zip -r templates.zip .
    cd -
  fi
  
  $npm_execpath just check
  $npm_execpath vite build
  
  sed 's+media=\"(device+media=\"screen and (device+g' dist/index.html | sed 's+</head>+<meta name=\"apple-touch-fullscreen\" content=\"yes\" /></head>+g' > index.html.tmp 
  mv index.html.tmp dist/index.html

alias p := prod
prod:
  $npm_execpath just build
  $npm_execpath vite preview --host

serve:
  pnpm vite preview --host

alias t := test
test:
  sed -i.bak 's|DEV$1\\.|DEV$1?\\.|g' node_modules/.pnpm/solid-js@*/node_modules/solid-js/store/dist/dev.js
  sed -i.bak 's|\"./integration\"|\"./integration.js\"|g' node_modules/.pnpm/@solidjs+router@*_solid-js@*/node_modules/@solidjs/router/dist/routing.js
  sed -i.bak 's|\"./lifecycle\"|\"./lifecycle.js\"|g' node_modules/.pnpm/@solidjs+router@*_solid-js@*/node_modules/@solidjs/router/dist/routing.js
  sed -i.bak 's|\"./utils\"|\"./utils.js\"|g' node_modules/.pnpm/@solidjs+router@*_solid-js@*/node_modules/@solidjs/router/dist/routing.js
  TZ=Europe/Paris $npm_execpath vitest run

test-ui:
  TZ=Europe/Paris $npm_execpath vitest --ui

test-coverage:
  TZ=Europe/Paris $npm_execpath vitest --coverage

test-browser:
  $npm_execpath playwright test --browser=all

alias f := format
format:
  $npm_execpath prettier --write './src'

check-format:
  $npm_execpath prettier --check './src'

alias l := lint
lint:
  $npm_execpath eslint './src'