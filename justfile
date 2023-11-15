# show list
default:
  just --list

alias d := dev
# run dev
dev:
  #!/usr/bin/env sh

  pnpm outdated

  if [ $? -ne 0 ]
  then
    read -p "Press enter to ignore..."
  fi

  pnpm vite --host

alias c := check
# check types
check:
  pnpm tsc --noEmit --skipLibCheck

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
  
  pnpm vite build
  
  sed 's+media=\"(device+media=\"screen and (device+g' dist/index.html | sed 's+</head>+<meta name=\"apple-touch-fullscreen\" content=\"yes\" /></head>+g' > index.html.tmp 
  mv index.html.tmp dist/index.html

alias p := prod
# build + preview
prod:
  pnpm j b
  pnpm j preview

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
  TZ=Europe/Paris pnpm vitest run 

# run tests with UI
test-ui:
  TZ=Europe/Paris pnpm vitest --silent --ui

# check tests' coverage
test-coverage:
  TZ=Europe/Paris pnpm vitest --coverage

# run end-to-end tests
test-e2e:
  pnpm playwright test --browser=all

# run end-to-end tests
test-e2e-ui:
  pnpm playwright test --ui

alias f := format
# format 'src' folder
format:
  pnpm prettier --write './src'

# check formatting in 'src' folder
check-format:
  pnpm prettier --check './src'

alias l := lint
# check link
lint:
  pnpm eslint './src'

# check link
lint-fix:
  pnpm eslint --fix './src'

alias uci := update-ci
update-ci:
  pnpm vite build -c ./vite-lib.config.ts
  node --loader tsx ./src/tests/utils/updater/updater.ts