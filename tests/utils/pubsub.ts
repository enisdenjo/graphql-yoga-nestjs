export interface Generator<T> {
  gen: AsyncGenerator<T, void, T>;
  next(val: T): void;
}

function createGenerator<T>(): Generator<T> {
  const pending: T[] = [];

  const deferred = {
    done: false,
    error: null as unknown,
    resolve: () => {
      // noop
    },
  };

  const gen = (async function* gen() {
    for (;;) {
      if (!pending.length) {
        // only wait if there are no pending messages available
        await new Promise<void>(resolve => (deferred.resolve = resolve));
      }
      // first flush
      while (pending.length) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        yield pending.shift()!;
      }
      // then error
      if (deferred.error) {
        throw deferred.error;
      }
      // or complete
      if (deferred.done) {
        return;
      }
    }
  })();

  gen.throw = async err => {
    if (!deferred.done) {
      deferred.done = true;
      deferred.error = err;
      deferred.resolve();
    }
    return { done: true, value: undefined };
  };

  gen.return = async () => {
    if (!deferred.done) {
      deferred.done = true;
      deferred.resolve();
    }
    return { done: true, value: undefined };
  };

  return {
    gen,
    next(val) {
      pending.push(val);
      deferred.resolve();
    },
  };
}

export function createPubSub<T>() {
  const nexts: Generator<T>['next'][] = [];
  return {
    pub(val: T) {
      nexts.forEach(next => next(val));
    },
    sub() {
      const { gen, next } = createGenerator<T>();
      nexts.push(next);
      const origReturn = gen.return;
      gen.return = () => {
        nexts.splice(nexts.indexOf(next), 1);
        return origReturn();
      };
      return gen;
    },
  };
}
