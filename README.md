# ioc-compiler-poc

> POC of IoC compiler for Angular DI providers

## How to run

1. `$ npm install`
1. `$ npm run compile`

See _/src/test_ folder at _*.compiled.ts_ files

## About

Angular application is platform independent,
meaning that we can target multiple platforms
with one codebase.

But different platform are different - so they require
different implementations of the same things
(views, services etc.).

So we need a robust way of injecting right things
for right target platforms and Angular provides for us
necessary tool - Dependency Injection. That is great
and powerful tool but when it comes to targeting multiple
platforms we end up with having multiple providers
for each of the platform.

And you have to provide all tokens your application
require for each platform to work properly. But you can
eaily make a mistake or even forget to provide on or few
tokens for some platform and you will only know about
it when you actually run the app on that platform and see
it crashes.

Wouldn't that be great to see this kind of errors ahead
of time, because you already know which tokens your app
needs.

That is where this compiler comes into the game - 
it allows you to coumple token with exact interface
which particular implementation should implement and
gives you static analisys (thanks to Typescript) if
something is missing or implementation does not satisfy
token requirement.

But of course this is custom format of storing providers
and it works fine with JIT compilation strategy of Angular
but it fails with AOT - because Angular compiler is unable
to locate those providers at compile time.
So we need a way to precomile this to the normal list of
Angular providers so that NGC can use it normally.

Please have a look into _/src/test_ folder where you can find
what excatly happening at compilation time.