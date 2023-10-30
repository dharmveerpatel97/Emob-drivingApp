package com.mirale;


import static com.mappls.sdk.navigation.ui.views.NavigationConstants.STEP_MANEUVER_MODIFIER_LEFT;
import static com.mappls.sdk.navigation.ui.views.NavigationConstants.STEP_MANEUVER_TYPE_ROTARY;

import android.os.Bundle;
import com.mirale.R;
import androidx.appcompat.app.AppCompatActivity;

import com.mappls.sdk.plugin.directions.view.ManeuverView;


public class MainActivityNav extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maneuver_view);

        ManeuverView maneuverView = findViewById(R.id.maneuver_view);
        if (maneuverView != null)
            maneuverView.setManeuverTypeAndModifier(STEP_MANEUVER_TYPE_ROTARY, STEP_MANEUVER_MODIFIER_LEFT);
    }
}
