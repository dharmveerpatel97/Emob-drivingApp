package com.mirale;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.Gravity;
import com.mappls.sdk.services.utils.Constants;
import android.widget.Toast;
// import com.mappls.sdk.maps.style.model.MapplsStyle;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

import com.mappls.sdk.geojson.utils.PolylineUtils;

import com.mirale.R;
import com.mappls.sdk.maps.MapplsMap;
import com.mappls.sdk.navigation.model.AdviseInfo;
import com.mappls.sdk.navigation.ui.navigation.NavigationCallback;
import com.mappls.sdk.navigation.ui.navigation.NavigationView;
import com.mappls.sdk.navigation.ui.navigation.NavigationViewCallback;

import timber.log.Timber;

public class NavigationUiActivity extends AppCompatActivity implements NavigationCallback, NavigationViewCallback{
//    , OnMapReadyCallback,MapplsMap.InfoWindowAdapter
    private NavigationView navigationView;

    private MainApplication app;



    public MainApplication getMyApplication() {
        return ((MainApplication) getApplication());
    }
    @SuppressLint("MissingInflatedId")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_navigation_ui);
        navigationView = findViewById(R.id.navigation_view);
        try {
            app = getMyApplication();

        } catch (Exception e) {
            //ignore
        }

        if (navigationView != null) {
            navigationView.onCreate(savedInstanceState);
            navigationView.setNavigationViewCallback(this);
            navigationView.setOnNavigationCallback(this);
        }


        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if(navigationView != null) {
                    navigationView.onBackPressed(true);
                }
            }
        });

    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
    }


    @Override
    public void onNavigationStarted() {
        Timber.e("onNavigationStarted");
    }

    @Override
    public void onNavigationCancelled() {
        Timber.e("onNavigationCancelled");
        finish();
    }

    @Override
    public void onNewRoute(String s) {

        PolylineUtils.decode(s, Constants.PRECISION_6);


    }

    @Override
    public void onRouteProgress(AdviseInfo adviseInfo) {


    }

    @Override
    public void onNavigationFinished() {
        Timber.e("onRouteFinished");
        finish();
    }

    @Override
    public void onWayPointReached(String name) {
        Toast.makeText(this, "Reached to " + name, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onNavigationMapReady(MapplsMap mapplsMap) {
        assert mapplsMap.getUiSettings() != null;
//mapplsMap.setMapplsStyle("standard_night");
//        mapplsMap.getUiSettings().setLogoGravity(navigationView.getC());
        mapplsMap.getUiSettings().setLogoGravity(Gravity.LEFT | Gravity.BOTTOM);
        mapplsMap.getUiSettings().setLogoMargins(500, 0, 0, 700);

    }

    @Override
    public void searchAlongRoute() {

    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        if (navigationView != null) {
            navigationView.onLowMemory();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (navigationView != null) {
            navigationView.onResume();
        }
    }

    @Override
    public void onStart() {
        super.onStart();
      if (navigationView != null) {
    navigationView.onStart();
}
    }

    @Override
    public void onStop() {
        super.onStop();
        if (navigationView != null) {
            navigationView.onStop();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (navigationView != null) {
            navigationView.onDestroy();  //For Fragment call this in onDestroyView()
        }
    }

//    @Override
//    public void onBackPressed() {
//        super.onBackPressed();
////        MapplsNavigationHelper.getInstance().stopNavigation();
////        finish();
////        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
////            @Override
////            public void handleOnBackPressed() {
////                navigationView.onBackPressed(true);
////            }
////        });
//    }

}