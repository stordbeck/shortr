.PHONY: $(MAKECMDGOALS)

# `make setup` will be used after cloning or downloading to fulfill
# dependencies, and setup the the project in an initial state.
# This is where you might download rubygems, node_modules, packages,
# compile code, build container images, initialize a database,
# anything else that needs to happen before your server is started
# for the first time
setup:
	docker-compose -f docker-compose.db.yml up --build --renew-anon-volumes --detach

teardown:
	docker-compose -f docker-compose.db.yml down --volumes --remove-orphans

# `make server` will be used after `make setup` in order to start
# an http server process that listens on any unreserved port
#	of your choice (e.g. 8080). 
server:
	docker-compose -f docker-compose.server.yml up --build

# `make test` will be used after `make setup` in order to run
# your test suite.
test:
	docker-compose -f docker-compose.test.yml build
	@make -j 2 server-test client-test

server-test:
	docker-compose -f docker-compose.test.yml run --rm server_test

client-test:
	docker-compose -f docker-compose.test.yml run --rm client_test