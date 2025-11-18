# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# ===== Kotlin Serialization =====
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}

-keep,includedescriptorclasses class com.example.todocompose.**$$serializer { *; }
-keepclassmembers class com.example.todocompose.** {
    *** Companion;
}
-keepclasseswithmembers class com.example.todocompose.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# ===== DataStore =====
-keep class androidx.datastore.*.** {*;}

# ===== Jetpack Compose =====
-keep class androidx.compose.** { *; }
-dontwarn androidx.compose.**

# ===== Coroutines =====
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ===== ViewModel =====
-keep class * extends androidx.lifecycle.ViewModel {
    <init>();
}
-keep class * extends androidx.lifecycle.AndroidViewModel {
    <init>(android.app.Application);
}
