import { getRandomId } from 'base/src';
import socketStore from 'page-spy-browser/src/helpers/socket';
import { makeMessage, DEBUG_MESSAGE_TYPE } from 'base/src/message';
import { parseUserAgent } from 'base/src/device';
import '../../deps/modernizr';
import { SpySystem, PageSpyPlugin } from '@huolala-tech/page-spy-types';
import { computeResult } from './feature';

window.Modernizr.addTest(
  'finally',
  Modernizr.promises && !!Promise.prototype.finally,
);
window.Modernizr.addTest(
  'reflect',
  'Reflect' in window &&
    typeof window.Reflect === 'object' &&
    typeof Reflect.has === 'function' &&
    [
      'apply',
      'construct',
      'defineProperty',
      'deleteProperty',
      'getOwnPropertyDescriptor',
      'getPrototypeOf',
      'has',
      'isExtensible',
      'ownKeys',
      'preventExtensions',
      'setPrototypeOf',
    ].every((i) => Reflect.has(Reflect, i)),
);

export default class SystemPlugin implements PageSpyPlugin {
  public name = 'SystemPlugin';

  public static hasInitd = false;

  // eslint-disable-next-line class-methods-use-this
  public async onCreated() {
    if (SystemPlugin.hasInitd) return;
    SystemPlugin.hasInitd = true;

    const id = getRandomId();
    const features = await computeResult();
    socketStore.broadcastMessage(
      makeMessage(DEBUG_MESSAGE_TYPE.SYSTEM, {
        id,
        system: {
          ua: navigator.userAgent,
          ...parseUserAgent(),
        },
        features,
      } as SpySystem.DataItem),
      false,
    );
  }
}
