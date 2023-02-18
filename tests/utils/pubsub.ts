export type Iterator<T> = AsyncGenerator<T, void, T>;

function createIterator<T>(): Iterator<T> {
  const pending: T[] = [];

  const deferred = {
    done: false,
    error: null as unknown,
    resolve: () => {
      // noop
    },
  };

  const iterator = (async function* iterator() {
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

  iterator.throw = async err => {
    if (!deferred.done) {
      deferred.done = true;
      deferred.error = err;
      deferred.resolve();
    }
    return { done: true, value: undefined };
  };

  iterator.return = async () => {
    if (!deferred.done) {
      deferred.done = true;
      deferred.resolve();
    }
    return { done: true, value: undefined };
  };

  return iterator;
}

export function createPubSub<T>() {
  const i: Iterator<T>[] = [];
  return {
    pub(val: T) {
      i.forEach(iterator => iterator.next(val));
    },
    sub() {
      const iterator = createIterator<T>();
      i.push(iterator);
      const origReturn = iterator.return;
      iterator.return = () => {
        i.splice(i.indexOf(iterator), 1);
        return origReturn();
      };
      return iterator;
    },
  };
}
