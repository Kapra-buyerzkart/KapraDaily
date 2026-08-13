package com.buyerskart.customer.phonehint

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.common.ConnectionResult
import com.google.android.gms.common.GoogleApiAvailability

@ReactModule(name = PhoneNumberHintModule.NAME)
class PhoneNumberHintModule(private val reactContext: ReactApplicationContext) :
    NativePhoneNumberHintSpec(reactContext), ActivityEventListener {

  private var pendingPromise: Promise? = null

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName(): String = NAME

  override fun requestPhoneNumber(promise: Promise) {
    val activity = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject(E_UNAVAILABLE, "No activity is attached to launch the picker from")
      return
    }
    if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(activity) !=
        ConnectionResult.SUCCESS) {
      promise.reject(E_UNAVAILABLE, "Google Play services is not available on this device")
      return
    }
    if (pendingPromise != null) {
      promise.reject(E_IN_PROGRESS, "A phone number hint request is already in progress")
      return
    }

    pendingPromise = promise
    Identity.getSignInClient(activity)
        .getPhoneNumberHintIntent(GetPhoneNumberHintIntentRequest.builder().build())
        .addOnSuccessListener { result ->
          try {
            activity.startIntentSenderForResult(result.intentSender, REQUEST_CODE, null, 0, 0, 0)
          } catch (e: Exception) {
            settle(null, E_UNAVAILABLE, e.message ?: "Could not launch the phone number picker")
          }
        }
        .addOnFailureListener { e ->
          settle(null, E_UNAVAILABLE, e.message ?: "No phone number hint is available")
        }
  }

  override fun onActivityResult(
      activity: Activity,
      requestCode: Int,
      resultCode: Int,
      data: Intent?
  ) {
    if (requestCode != REQUEST_CODE) return

    if (resultCode != Activity.RESULT_OK || data == null) {
      settle(null, null, null)
      return
    }

    try {
      settle(Identity.getSignInClient(reactContext).getPhoneNumberFromIntent(data), null, null)
    } catch (e: Exception) {
      settle(null, E_UNAVAILABLE, e.message ?: "Could not read the selected phone number")
    }
  }

  override fun onNewIntent(intent: Intent) = Unit

  override fun invalidate() {
    reactContext.removeActivityEventListener(this)
    settle(null, E_CANCELLED, "The screen was torn down before a number was chosen")
    super.invalidate()
  }

  @Synchronized
  private fun settle(phoneNumber: String?, errorCode: String?, errorMessage: String?) {
    val promise = pendingPromise ?: return
    pendingPromise = null
    if (errorCode != null) {
      promise.reject(errorCode, errorMessage)
    } else {
      promise.resolve(phoneNumber)
    }
  }

  companion object {
    const val NAME = "PhoneNumberHint"
    private const val REQUEST_CODE = 7391
    private const val E_UNAVAILABLE = "E_HINT_UNAVAILABLE"
    private const val E_IN_PROGRESS = "E_HINT_IN_PROGRESS"
    private const val E_CANCELLED = "E_HINT_CANCELLED"
  }
}
