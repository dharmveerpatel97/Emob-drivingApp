package com.mirale.utils;

import androidx.annotation.NonNull;

import com.mappls.sdk.maps.location.CompassEngine;
import com.mappls.sdk.maps.location.CompassListener;

public class NavigationCompassEngine implements CompassEngine {

    @Override
    public void addCompassListener(@NonNull CompassListener compassListener) {

    }

    @Override
    public void removeCompassListener(@NonNull CompassListener compassListener) {

    }

    @Override
    public float getLastHeading() {
        return 0;
    }

    @Override
    public int getLastAccuracySensorStatus() {
        return 0;
    }
}
