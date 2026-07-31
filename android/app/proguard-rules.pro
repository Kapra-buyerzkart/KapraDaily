# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ---------------------------------------------------------------------------
# Keep rules for R8 (minifyEnabled + shrinkResources are on for release).
#
# Most React Native libraries ship their own consumer-proguard rules, which are
# merged in automatically. The rules below cover the dependencies that rely on
# reflection or JNI and are NOT fully covered by consumer rules.
# ---------------------------------------------------------------------------

# --- Annotations / generics / line numbers ---------------------------------
# Needed by anything doing reflection; line numbers keep crash reports readable.
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# --- React Native / Hermes --------------------------------------------------
# Native methods are resolved by name from C++ and must not be renamed.
-keepclasseswithmembernames class * {
    native <methods>;
}
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keep class com.facebook.jni.** { *; }

# --- Razorpay ---------------------------------------------------------------
# Razorpay's checkout drives a WebView bridge and resolves payment callbacks
# reflectively; these are the vendor's documented rules.
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclasseswithmembers class * {
    public void onPayment*(...);
}
-optimizations !method/inlining/*

# --- OneSignal --------------------------------------------------------------
-keep class com.onesignal.** { *; }
-dontwarn com.onesignal.**

# --- VisionCamera (frame processors disabled, code scanner enabled) ---------
-keep class com.mrousavy.camera.** { *; }
-dontwarn com.mrousavy.camera.**
-keep class com.google.mlkit.** { *; }
-dontwarn com.google.mlkit.**

# --- Play Services / Maps / Geolocation -------------------------------------
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# --- Keychain (AndroidX security / crypto via reflection) -------------------
-keep class com.oblador.keychain.** { *; }

# --- OkHttp / Okio (RN networking transitive deps) --------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
