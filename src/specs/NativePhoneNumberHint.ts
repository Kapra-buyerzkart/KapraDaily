import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  requestPhoneNumber(): Promise<string | null>;
}

export default TurboModuleRegistry.get<Spec>('PhoneNumberHint');
