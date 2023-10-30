package com.mirale; // replace your-apps-package-name with your app’s package name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import android.util.Log;
import android.os.Bundle;
import android.os.Build;
import android.view.LayoutInflater;
import android.view.View;
import android.content.Intent;
import android.provider.Settings;
import android.net.Uri;
public class BubblePermission extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    BubblePermission(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }
    @Override
    public String getName() {
        return "BubblePermission";
    }
    @ReactMethod
    public void createCalendarEvent(String name, String location) {
        Log.e("CalendarModule", "Create event called with name: " + name + " and location: " + reactContext.getPackageName());
        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + reactContext.getPackageName()));
        Bundle bundle = new Bundle();
        reactContext.startActivityForResult(intent, 11223, bundle);
    }
}
