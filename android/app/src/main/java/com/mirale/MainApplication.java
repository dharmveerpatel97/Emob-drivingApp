package com.mirale;

import static androidx.databinding.DataBindingUtil.setContentView;
import static com.mappls.sdk.maps.Mappls.getApplicationContext;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.mappls.sdk.navigation.ui.navigation.NavigationView;
import com.mappls.sdk.geojson.Point;
import com.mappls.sdk.maps.MapView;
import com.mappls.sdk.maps.MapplsMap;
import com.mappls.sdk.maps.Style;
import com.mappls.sdk.maps.location.LocationComponent;
import com.mappls.sdk.maps.location.LocationComponentActivationOptions;
import com.mappls.sdk.maps.location.LocationComponentOptions;
import com.mappls.sdk.maps.location.engine.LocationEngine;
import com.mappls.sdk.maps.location.engine.LocationEngineCallback;
import com.mappls.sdk.maps.location.engine.LocationEngineRequest;
import com.mappls.sdk.maps.location.engine.LocationEngineResult;
import com.mappls.sdk.maps.location.modes.CameraMode;
import com.mappls.sdk.maps.location.modes.RenderMode;
import com.mappls.sdk.maps.location.permissions.PermissionsListener;
import com.mappls.sdk.maps.location.permissions.PermissionsManager;
import com.mappls.sdk.navigation.iface.INavigationListener;
import com.mappls.sdk.navigation.ui.navigation.NavigationCallback;
import com.mappls.sdk.navigation.ui.navigation.NavigationView;
import com.mappls.sdk.navigation.ui.navigation.NavigationViewCallback;
import com.mappls.sdk.services.api.OnResponseCallback;
import com.mappls.sdk.services.api.directions.DirectionsCriteria;
import com.mappls.sdk.services.api.directions.MapplsDirectionManager;
import com.mappls.sdk.services.api.directions.MapplsDirections;
import com.mirale.maps.plugins.BearingIconPlugin;
import com.mirale.maps.plugins.DirectionPolylinePlugin;
import com.mirale.maps.traffic.TrafficPlugin;
import com.mirale.newarchitecture.MainApplicationReactNativeHost;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.mirale.R;

import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;

import com.mappls.sdk.maps.Mappls;
import com.mappls.sdk.navigation.MapplsNavigationHelper;
import com.mappls.sdk.navigation.NavLocation;
import com.mappls.sdk.navigation.NavigationApplication;
import com.mappls.sdk.navigation.ui.navigation.MapplsNavigationViewHelper;
import com.mappls.sdk.services.account.MapplsAccountManager;
import com.mappls.sdk.services.api.autosuggest.model.ELocation;
import com.mappls.sdk.services.api.directions.models.DirectionsResponse;

import com.mappls.sdk.navigation.NavigationApplication;

import timber.log.Timber;

public class MainApplication extends NavigationApplication implements ReactApplication {
    ELocation eLocation = null;
    private Location currentLocation;
    private Bundle savedInstanceState;
    private LocationEngine locationEngine;
    private NavLocation startNavigationLocation;
    private DirectionsResponse trip;
    private MapView mapView;
    // NavigationView navigationView = new NavigationView(this);

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    packages.add(new MyBubbleAppPackage());
                    packages.add(new NavigationPackage());

                    //  package.add(new SDKNAvigationModule());
                    return packages;
                }


                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }
            };

    private final ReactNativeHost mNewArchitectureNativeHost =
            new MainApplicationReactNativeHost(this);
    private MapplsMap mapplsMap;

    @Override
    public ReactNativeHost getReactNativeHost() {
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            return mNewArchitectureNativeHost;
        } else {
            return mReactNativeHost;
        }
    }


    public String getAtlasClientId() {
        return "33OkryzDZsL2h99ywO9d3m9s-1-r6Q1HSyTfrL1ZwPLNZmBn-3Z2mwqU_lmdigkFC54ptXvlvbFZ-I7jtO_WJBt97TFG3nOo";
    }

    public String getAtlasClientSecret() {
        return "lrFxI-iSEg9CS8FlzmR-QEdsll2Zu6vbyX7ThtS2DUkBCpI4yGt21FufDtPPgjuhqrrvzR4ygseS4855lIBzrMP4AVmhOa1_w9XLaTmNB5Q=";
    }

    public String getMapSDKKey() {
        return "8045d8136d66d2219cee967619661f77";
    }

    public String getRestAPIKey() {
        return "8045d8136d66d2219cee967619661f77";
    }


    public ELocation getELocation() {
        return eLocation;
    }

    public void setELocation(ELocation eLocation) {
        this.eLocation = eLocation;
    }

    public Location getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(Location currentLocation) {
        this.currentLocation = currentLocation;
    }

    public NavLocation getStartNavigationLocation() {
        return startNavigationLocation;
    }

    public void setStartNavigationLocation(NavLocation startNavigationLocation) {
        this.startNavigationLocation = startNavigationLocation;
    }

    public DirectionsResponse getTrip() {
        return trip;
    }

    public void setTrip(DirectionsResponse trip) {
        this.trip = trip;
    }


    @Override
    public void onTerminate() {
        super.onTerminate();
    }

    @Override
    public void onCreate() {


        super.onCreate();

        MapplsNavigationHelper.getInstance().init(this);
        MapplsNavigationViewHelper.getInstance().init(this);
       MapplsAccountManager.getInstance().setRestAPIKey(getRestAPIKey());
        MapplsAccountManager.getInstance().setMapSDKKey(getMapSDKKey());
        MapplsAccountManager.getInstance().setAtlasClientId(getAtlasClientId());
        MapplsAccountManager.getInstance().setAtlasClientSecret(getAtlasClientSecret());
        MapplsNavigationHelper.getInstance().setNavigationActivityClass(NavigationActivity.class);
        MapplsNavigationHelper.getInstance().setJunctionViewEnabled(true);
        MapplsNavigationHelper.getInstance().setNavigationEventEnabled(true);
        Mappls.getInstance(this);
    }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   *
   * @param context
   * @param reactInstanceManager
   */

}
