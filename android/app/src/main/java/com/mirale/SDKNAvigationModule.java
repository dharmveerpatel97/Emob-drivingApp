


package com.mirale; 

import static com.mappls.sdk.maps.Mappls.getApplicationContext;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.annotation.SuppressLint;
import android.provider.Settings;
import android.provider.Settings.Secure;
import androidx.annotation.NonNull;
import android.content.Intent;

import com.mappls.sdk.geojson.LineString;
import com.mappls.sdk.maps.MapplsMap;
import com.mappls.sdk.maps.OnMapReadyCallback;
//import com.google.android.material.navigation.NavigationView;
import com.mappls.sdk.geojson.Point;
import android.content.IntentFilter;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import android.app.Activity;
import android.content.Intent;

import com.mappls.sdk.maps.geometry.LatLng;
import com.mappls.sdk.navigation.NavLocation;
import com.mappls.sdk.navigation.data.WayPoint;
import com.mappls.sdk.navigation.events.NavEvent;
import com.mappls.sdk.navigation.iface.INavigationListener;

import com.mappls.sdk.navigation.MapplsNavigationHelper;
import com.mappls.sdk.navigation.NavigationApplication;

import android.provider.MediaStore;


import com.mappls.sdk.navigation.iface.OnAuthentication;
import com.mappls.sdk.navigation.model.AdviseInfo;
//import com.mappls.sdk.navigation.ui.navigation.NavigationView;
import com.mappls.sdk.navigation.ui.NavigationOptions;
import com.mappls.sdk.navigation.ui.navigation.MapplsNavigationViewHelper;
import com.mappls.sdk.navigation.ui.navigation.NavigationCallback;
import com.mappls.sdk.navigation.ui.navigation.NavigationView;
import com.mappls.sdk.navigation.ui.navigation.NavigationViewCallback;
import com.mappls.sdk.navigation.util.ErrorType;
import com.mappls.sdk.services.api.OnResponseCallback;
import com.mappls.sdk.services.api.autosuggest.model.ELocation;
import com.mappls.sdk.services.api.directions.MapplsDirectionManager;
import com.mappls.sdk.services.api.directions.models.DirectionsResponse;
import com.mappls.sdk.services.api.directions.models.DirectionsRoute;
import com.mirale.HomeActivity;
import androidx.annotation.Nullable;
import com.mappls.sdk.navigation.model.NavigationResponse;
import com.mappls.sdk.maps.MapView;
import com.mirale.maps.plugins.DirectionPolylinePlugin;
import com.mirale.maps.plugins.MapEventsPlugin;
import com.mirale.maps.plugins.RouteArrowPlugin;
// import com.mappls.app.navigation.demo.
import com.mappls.sdk.services.api.directions.MapplsDirections;
import com.mappls.sdk.services.api.directions.DirectionsCriteria;
// import com.mappls.app.navigation.demo.utils.
import com.facebook.react.bridge.Callback;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

import timber.log.Timber;


public class SDKNAvigationModule extends  ReactContextBaseJavaModule implements OnMapReadyCallback {
     ReactApplicationContext context = getReactApplicationContext();
FragmentManager manager;
    private MainApplication app;
    private RouteViewModel viewModel;
    private  MapView mapView;
    
     
       private DirectionPolylinePlugin directionPolylinePlugin;
    SDKNAvigationModule(ReactApplicationContext context) {
       super(context);
       // context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "SDKNAvigationModule";
    }

    @ReactMethod
    public void sayHello (String name, Callback cb) {
        try {
            String hello = "Hello " + name;
            cb.invoke(null, hello);
        } catch (Exception err) {
            cb.invoke(err, null);
        }
    }

    @ReactMethod
    public void NavigateMe(Double latitude,Double longitude,Double desLAti,Double desLong)
    {

   MapplsDirections.Builder builder = MapplsDirections.builder()

    .origin(Point.fromLngLat(longitude, latitude))
    .destination(Point.fromLngLat(desLong,desLAti))
            
     .profile(DirectionsCriteria.PROFILE_DRIVING)
     .resource(DirectionsCriteria.RESOURCE_ROUTE_ETA)
     .steps(true)
     .alternatives(true)
     .annotations(DirectionsCriteria.ANNOTATION_CONGESTION, DirectionsCriteria.ANNOTATION_NODES, DirectionsCriteria.ANNOTATION_DURATION)
     .routeRefresh(true)
     .deviceId(Settings.Secure.getString(getApplicationContext().getContentResolver(), Settings.Secure.ANDROID_ID))
     .overview(DirectionsCriteria.OVERVIEW_FULL);

MapplsDirections mapplsDirections = builder.build();
        MapplsNavigationHelper.getInstance().setJunctionViewMode("night");
MapplsDirectionManager.newInstance(mapplsDirections).call(new OnResponseCallback<DirectionsResponse>() {
    @Override
public void onSuccess(DirectionsResponse directionsResponse) {
        Log.e("directionre", String.valueOf(directionsResponse));
         List<WayPoint> WayPoint = new ArrayList<>() ;
          WayPoint w = new WayPoint(desLAti, desLong,"NeuroROute");

        NavLocation navLocation = new NavLocation("navigation");
        navLocation.setLatitude(latitude);
        navLocation.setLongitude(longitude);




    MapplsNavigationViewHelper.getInstance().setStartLocation(navLocation);
        ELocation eLocation = new ELocation();
        eLocation.entryLongitude = longitude;
        eLocation.longitude = desLong;
        eLocation.entryLatitude = latitude;
        eLocation.latitude = desLAti;


        MapplsNavigationViewHelper.getInstance().setDestination(eLocation);
        MapplsNavigationHelper.getInstance().startNavigation(directionsResponse, 0, new LatLng(latitude, longitude), w, WayPoint, new OnAuthentication() {
            @Override
            public void onSuccess() {
                Log.e("success navigation","" );
                Intent intent = new Intent(context, NavigationUiActivity.class);
                 if(intent.resolveActivity(context.getPackageManager()) != null){
                   intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                   context.startActivity(intent);

                 }

                MapplsNavigationHelper.getInstance().addNavigationListener(new INavigationListener() {
                    @Override
                    public void onNavigationStarted() {

                    }

                    @Override
                    public void onReRoutingRequested() {
                        Log.e("onNewRoute reroute","" );
                    }

                    @Override
                    public void onNewRoute(String s) {
                        Log.e("onNewRoute navigation","" );
                    }

                    @Override
                    public void onRouteProgress(@NonNull AdviseInfo adviseInfo) {
                        Log.e("onNewRoute progess", String.valueOf(adviseInfo));
                    }

                    @Override
                    public void onETARefreshed(String s) {

                    }

                    @Override
                    public void onNavigationCancelled() {

                    }

                    @Override
                    public void onNavigationFinished() {

                    }

                    @Override
                    public void onWayPointReached(com.mappls.sdk.navigation.data.WayPoint wayPoint) {
                        Log.e("onNewRoute waypoint", String.valueOf(wayPoint));
                    }

                    @Override
                    public void onEvent(@Nullable NavEvent navEvent) {
                        Log.e("onNewRoute event", String.valueOf(navEvent));

                    }
                });
            }

            @Override
            public void onFailure(int i, String s, Throwable throwable) {
                Log.e("failure navigation",s+i );
            }
        });
 }

    public WayPoint getNavigationGeoPoint(ELocation eLocation) {
        try {
            if (eLocation.entryLatitude != null && eLocation.entryLongitude != null && eLocation.entryLatitude > 0 && eLocation.entryLongitude > 0)
                return new WayPoint(eLocation.entryLatitude, eLocation.entryLongitude, eLocation.placeName, eLocation.placeName);
            else if(eLocation.latitude != null && eLocation.longitude != null) {
                return new WayPoint(eLocation.latitude, eLocation.longitude, eLocation.placeName, eLocation.placeName);
            } else {
                return new WayPoint(eLocation.getMapplsPin(), eLocation.placeName, eLocation.placeName);
            }
        } catch (Exception e) {
            return new WayPoint(0, 0, null, null);
        }
    }

    @Override
public void onError(int i, String s) {
        Log.e("directionreerror", String.valueOf(s));
        //Handle Error
  }
});

    }

    @Override
    public void onMapReady(@NonNull MapplsMap mapplsMap) {

        DirectionPolylinePlugin directionPolylinePlugin = new DirectionPolylinePlugin(mapView, mapplsMap);
        List<DirectionsRoute> directionsRoutes = new ArrayList<>();
        String locations = MapplsNavigationHelper.getInstance().getCurrentRoute().geometry();

        directionsRoutes.add(MapplsNavigationHelper.getInstance().getCurrentRoute());
        List<LineString> listOfPoint = new ArrayList<>();
        listOfPoint.add(LineString.fromPolyline(locations, 6));
        LatLng latLng = null;
        if (app.getELocation() != null && app.getELocation().latitude != null && app.getELocation().longitude != null) {
            latLng = new LatLng(app.getELocation().latitude, app.getELocation().longitude);
        }
        List<LatLng> wayPoints = new ArrayList<>();
        for (int i = 0; i < app.getTrip().waypoints().size() - 1; i++) {
            if (i != 0) {
                Point point = app.getTrip().waypoints().get(i).location();
                wayPoints.add(new LatLng(point.latitude(), point.longitude()));
            }
        }
        directionPolylinePlugin.setTrips(listOfPoint, null, latLng, wayPoints, directionsRoutes); // need to add way point

    }

    @Override
    public void onMapError(int i, String s) {

    }
}