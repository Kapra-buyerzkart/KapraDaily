package com.buyerskart.customer.phonehint

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class PhoneNumberHintPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
      if (name == PhoneNumberHintModule.NAME) PhoneNumberHintModule(reactContext) else null

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
    mapOf(
        PhoneNumberHintModule.NAME to
            ReactModuleInfo(
                PhoneNumberHintModule.NAME,
                PhoneNumberHintModule::class.java.name,
                false,
                false,
                false,
                true,
            )
    )
  }
}
