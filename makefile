BUILD = "lib"
INDEX = "index.js"
ESLINT_FILES = "**/*.{js,ts,tsx}"
PRETTIER_FILES = "**/*.{js,json,md,ts,tsx}"

DONE = echo [style] ✓ $@ done

.PHONY: default
default:
	echo "Please enter a command..."
	$(DONE)

$(verbose).SILENT:

.PHONY: clean
clean:
	rm -rf $(BUILD)
	$(DONE)

.PHONY: wipe
wipe: clean
	rm -rf node_modules
	$(DONE)

.PHONY: install
install: wipe
	npm install
	npm audit fix
	$(DONE)

.PHONY: lint
lint:
	npm run eslint --silent -- \
		$(ESLINT_FILES)
	$(DONE)

.PHONY: format
format:
	npm run prettier --silent -- \
		--write $(PRETTIER_FILES)
	$(DONE)

.PHONY: test
test:
	npm run jest
	$(DONE)

.PHONY: dev
dev: clean
	npm run tsc -- \
		--watch
	$(DONE)

.PHONY: build
build: clean
	npm run tsc
	$(DONE)

.PHONY: start
start: build
	node $(BUILD)/$(INDEX)
	$(DONE)

.PHONY: publish/next
publish/next: build
	npm publish --tag=next
	$(DONE)

.PHONY: publish/latest
publish/latest: build
	npm publish --tag=latest
	$(DONE)
