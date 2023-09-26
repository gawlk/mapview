# show list
default:
  just --list

pm := `if [[ -z "${npm_execpath:-}" ]]; then echo "pnpm"; else echo "$npm_execpath"; fi`

alias d := dev
# run dev
dev:
  #!/usr/bin/env sh

  {{pm}} outdated

  if [ $? -ne 0 ]
  then
    read -p "Press enter to ignore..."
  fi

  {{pm}} vite --host

alias c := check
# check types
check:
  {{pm}} tsc --noEmit --skipLibCheck

alias b := build
# build project
build:
  #!/usr/bin/env sh
  if [ command -v zip ]
  then
    cd src/assets/templates
    rm -f templates.zip
    zip -r templates.zip .
    cd -
  fi
  
  {{pm}} just check
  {{pm}} vite build
  
  sed 's+media=\"(device+media=\"screen and (device+g' dist/index.html | sed 's+</head>+<meta name=\"apple-touch-fullscreen\" content=\"yes\" /></head>+g' > index.html.tmp 
  mv index.html.tmp dist/index.html

alias p := prod
# build + preview
prod:
  {{pm}} just build
  {{pm}} vite preview --host

# preview only
preview:
  pnpm vite preview --host

alias t := test
# run tests
test:
  sed -i.bak 's|DEV$1\\.|DEV$1?\\.|g' node_modules/.pnpm/solid-js@*/node_modules/solid-js/store/dist/dev.js
  sed -i.bak 's|\"./integration\"|\"./integration.js\"|g' node_modules/.pnpm/@solidjs+router@*_solid-js@*/node_modules/@solidjs/router/dist/routing.js
  sed -i.bak 's|\"./lifecycle\"|\"./lifecycle.js\"|g' node_modules/.pnpm/@solidjs+router@*_solid-js@*/node_modules/@solidjs/router/dist/routing.js
  sed -i.bak 's|\"./utils\"|\"./utils.js\"|g' node_modules/.pnpm/@solidjs+router@*_solid-js@*/node_modules/@solidjs/router/dist/routing.js
  TZ=Europe/Paris {{pm}} vitest run

# run tests with UI
test-ui:
  TZ=Europe/Paris {{pm}} vitest --ui

# check tests' coverage
test-coverage:
  TZ=Europe/Paris {{pm}} vitest --coverage

# run end-to-end tests
test-e2e:
  {{pm}} playwright test --browser=all

alias f := format
# format 'src' folder
format:
  {{pm}} prettier --write './src'

# check formatting in 'src' folder
check-format:
  {{pm}} prettier --check './src'

alias l := lint
# check link
lint:
  {{pm}} eslint './src'