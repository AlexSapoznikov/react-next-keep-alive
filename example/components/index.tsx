import KeepAliveProviderImport from './provider';
import withKeepAliveImport from './component';
import {
  useKeepAliveMountEffect as useKeepAliveMountEffectImport,
  useKeepAliveUnmountEffect as useKeepAliveUnmountEffectImport
} from './hooks';
import { keepAliveLoadFromCache as keepAliveLoadFromCacheImport } from './controls';

export const KeepAliveProvider = KeepAliveProviderImport;
export const withKeepAlive = withKeepAliveImport;
export const useKeepAliveMountEffect = useKeepAliveMountEffectImport;
export const useKeepAliveUnmountEffect = useKeepAliveUnmountEffectImport;
export const keepAliveLoadFromCache = keepAliveLoadFromCacheImport;
