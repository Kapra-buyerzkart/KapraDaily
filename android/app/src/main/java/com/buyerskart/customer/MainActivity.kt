package com.buyerskart.customer

import android.os.Bundle
import android.view.ViewGroup
import android.view.ViewTreeObserver
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "KapraDaily"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    dropBootSplashWindowBackground()
  }

  private fun dropBootSplashWindowBackground() {
    val content = findViewById<ViewGroup>(android.R.id.content)
    content.viewTreeObserver.addOnPreDrawListener(
        object : ViewTreeObserver.OnPreDrawListener {
          override fun onPreDraw(): Boolean {
            if (!hasReactContent(content)) return true

            val observer = content.viewTreeObserver
            if (observer.isAlive) {
              observer.removeOnPreDrawListener(this)
            }
            content.post { window.setBackgroundDrawableResource(R.color.window_background) }
            return true
          }
        })
  }

  private fun hasReactContent(content: ViewGroup): Boolean {
    if (content.childCount == 0) return false
    val reactRoot = content.getChildAt(0) as? ViewGroup ?: return true
    return reactRoot.childCount > 0
  }
}
