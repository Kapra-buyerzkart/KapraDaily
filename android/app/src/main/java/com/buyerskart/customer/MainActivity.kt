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

  /**
   * The manifest launches this activity with BootTheme, whose windowBackground is
   * the branded orange splash drawable. It has to stay up until React paints its
   * first frame: the system splash dismisses as soon as the activity starts, and
   * AppLoader (the same orange, see src/styles/colors.js) only appears once the JS
   * bundle has loaded, so anything else here shows as a white gap between the two.
   *
   * It must not outlive that first frame either. The window background sits behind
   * the entire React view tree for the rest of the session, and react-native-screens
   * leaves it exposed wherever no screen is painted - cross-fade transitions,
   * screens unfreezing via freezeOnBlur, the first frame of a lazily required
   * screen - which flashed the orange splash mid-navigation. Blur views are worse:
   * they draw the decor view, window background included, into every blurred frame,
   * which tinted the event-details glass permanently orange.
   *
   * So swap it for a plain colour at the handover point, once React has content on
   * screen and is covering the window itself.
   */
  private fun dropBootSplashWindowBackground() {
    val content = findViewById<ViewGroup>(android.R.id.content)
    val observer = content.viewTreeObserver

    observer.addOnPreDrawListener(
        object : ViewTreeObserver.OnPreDrawListener {
          override fun onPreDraw(): Boolean {
            if (!hasReactContent(content)) {
              // Never block the frame - the splash background is what should be
              // drawing while we wait.
              return true
            }

            if (observer.isAlive) {
              observer.removeOnPreDrawListener(this)
            } else {
              content.viewTreeObserver.removeOnPreDrawListener(this)
            }
            window.setBackgroundDrawableResource(R.color.window_background)
            return true
          }
        })
  }

  /**
   * True once React has committed a view tree. android.R.id.content holds the React
   * root view, which stays childless until the first render lands; if the hierarchy
   * ever turns out not to look like that, report ready rather than risk leaving the
   * splash drawable behind the app forever.
   */
  private fun hasReactContent(content: ViewGroup): Boolean {
    if (content.childCount == 0) return false
    val reactRoot = content.getChildAt(0) as? ViewGroup ?: return true
    return reactRoot.childCount > 0
  }
}
